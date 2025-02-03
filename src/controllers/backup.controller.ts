import {Request, Response, NextFunction} from 'express'
import {OK, CREATED} from '~/core/success.response.ts'
import {existsSync, mkdirSync, statSync, createReadStream} from 'fs'
import {join} from 'path'
import {v4 as uuidv4} from 'uuid'
import {validateFileTypeAndSize} from '~/utils/file.utils.ts'
import {fileProcessing} from '~/helper/fileProcessingQueue.helper.ts'
import {BadRequest} from '~/core/error.response.ts'
import {PrismaClient} from "@prisma/client";
import {BackupRepository} from "~/repositories/backup.repository.ts";
import {BackupService} from "~/services/backup.service.ts";
import {AppRepository} from "~/repositories/app.repository.ts";
import {AppService} from "~/services/app.service.ts";
import {rimraf} from "rimraf";
import {createBackupSchema} from "~/validations/backup.validation.ts";

const prismaClient = new PrismaClient()
const backupRepository = new BackupRepository(prismaClient)
const appRepository = new AppRepository(prismaClient)
const backupService = new BackupService(backupRepository)
const appService = new AppService(appRepository)

export class BackupController {
  async getBackups(req: Request, res: Response, next: NextFunction) {
    const backups = await backupService.getBackups()
    new OK({message: 'Backups retrieved successfully', metadata: backups}).send(res)
  }

  async getBackup(req: Request, res: Response, next: NextFunction) {
    const {id} = req.params

    if (isNaN(Number(id))) throw new BadRequest('Invalid ID')

    const backup = await backupService.getBackupById(Number(id))
    new OK({message: 'Backup retrieved successfully', metadata: backup}).send(res)
  }

  async createBackup(req: Request, res: Response, next: NextFunction) {
    const {appId, description} = createBackupSchema.parse(req.body)
    const app = await appService.getApp(Number(appId))

    if (!app) {
      throw new BadRequest('App not found')
    }

    const uploadsDir = join(__dirname, '..', 'uploads', 'backups', app.name)

    // Kiểm tra và tạo thư mục nếu chưa tồn tại
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, {recursive: true})
    }

    // Kiểm tra nếu `uploadsDir` là thư mục
    const uploadsDirStat = statSync(uploadsDir)
    if (!uploadsDirStat.isDirectory()) {
      throw new Error(`Path ${uploadsDir} is not a directory`)
    }

    const file = req.raw?.files?.file

    if (!file || !file.file) {
      throw new Error('File is required')
    }

    // Kiểm tra loại và kích thước file
    const {fileExtension, fileSizeIsValid, fileName} = validateFileTypeAndSize({
      filename: file.filename,
      size: file.size
    })

    if (!fileSizeIsValid) {
      throw new BadRequest('File size exceeds limit')
    }

    if (!fileExtension) {
      throw new BadRequest('Invalid file type')
    }

    // Tạo tên file an toàn
    const filename = `${uuidv4()}-${fileName}`
    const filepath = join(uploadsDir, filename)

    // Thêm vào hàng đợi xử lý file
    await fileProcessing({buffer: file.file, filepath})

    // Tạo backup trong cơ sở dữ liệu
    const newBackup = await backupService.createBackup({
      filename,
      filepath,
      filesize: file.size,
      appId: Number(appId),
      description,
      userId: req.user.userId
    })

    new CREATED({message: 'Backup created successfully', metadata: newBackup}).send(res)
  }

  async updateBackup(req: Request, res: Response, next: NextFunction) {
    const {id} = req.params

    const data = createBackupSchema.parse(req.body)

    if (isNaN(Number(id))) throw new BadRequest('Invalid ID')

    const backup = await backupService.getBackupById(Number(id))

    if (!backup) throw new BadRequest('Backup not found')

    const app = await appService.getApp(backup.appId)

    if (!app) throw new BadRequest('App not found')

    const file = req.raw?.files?.file

    let filepath;

    if (file && file.file) {

      const uploadsDir = join(__dirname, '..', 'uploads', 'backups', app.name)

      if (!existsSync(uploadsDir)) {
        mkdirSync(uploadsDir, {recursive: true})
      }

      // Kiểm tra nếu `uploadsDir` là thư mục
      const uploadsDirStat = statSync(uploadsDir)
      if (!uploadsDirStat.isDirectory()) {
        throw new Error(`Path ${uploadsDir} is not a directory`)
      }

      // Kiểm tra loại và kích thước file
      const {fileExtension, fileSizeIsValid, fileName} = validateFileTypeAndSize({
        filename: file.filename,
        size: file.size
      })

      if (!fileSizeIsValid) {
        throw new BadRequest('File size exceeds limit')
      }

      if (!fileExtension) {
        throw new BadRequest('Invalid file type')
      }

      // Tạo tên file an toàn
      const filename = `${uuidv4()}-${fileName}`
      filepath = join(uploadsDir, filename)

      // Thêm vào hàng đợi xử lý file
      await fileProcessing({buffer: file.file, filepath})
    }

    const updatedBackup = await backupService.updateBackup(Number(id), {...data, filepath})
    new OK({message: 'Backup updated successfully', metadata: updatedBackup}).send(res)
  }

  async deleteBackup(req: Request, res: Response, next: NextFunction) {
    const {id} = req.params

    if (isNaN(Number(id))) throw new BadRequest('Invalid ID')

    const backup = await backupService.getBackupById(Number(id))

    if (!backup) throw new BadRequest('Backup not found')

    const app = await appService.getApp(backup.appId)

    if (!app) throw new BadRequest('App not found')

    const filepath = join(__dirname, '..', 'uploads', 'backups', app.name, backup.filename)

    rimraf.sync(filepath)

    await backupService.deleteBackup(Number(id))
    new OK({message: 'Backup deleted successfully', metadata: undefined}).send(res)
  }

  async downloadBackup(req: Request, res: Response, next: NextFunction) {
    const {filename, appName} = req.params

    if (!appName) throw new BadRequest('App name is required')

    if (!filename) throw new BadRequest('Filename is required')

    const app = await appService.getByName(appName as string)

    if (!app) {
      throw new BadRequest('App not found')
    }

    const backup = await backupService.getBackupByFilename(filename)

    if (!backup) {
      throw new Error('Backup not found')
    }

    const filepath = join(__dirname, '..', 'uploads', 'backups', app.name, backup.filename)
    const fileStream = createReadStream(filepath)

    res.setHeader('Content-Disposition', `attachment; filename="${backup.filename}.tar.gz"`)
    res.setHeader('Content-Type', 'application/octet-stream')

    fileStream.pipe(res)
  }
}