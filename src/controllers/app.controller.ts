import {Request, Response} from 'express'
import {PrismaService} from '~/prisma/prisma.service.ts'
import {AppRepository} from '~/repositories/app.repository.ts'
import {AppService} from '~/services/app.service.ts'
import {CREATED, OK} from "~/core/success.response.ts";
import {BadRequest} from "~/core/error.response.ts";
import {createAppSchema, updateAppSchema} from "~/validations/app.validation.ts";
import {join} from "path";
import {createReadStream, existsSync, mkdirSync, statSync, unlinkSync} from "fs";
import {validateFileTypeAndSize} from "~/utils/file.utils.ts";
import {v4 as uuidv4} from "uuid";
import {fileProcessing} from "~/helper/fileProcessingQueue.helper.ts";
import {rimraf} from "rimraf";

const prismaService = new PrismaService()
const appRepository = new AppRepository(prismaService)
const appService = new AppService(appRepository)

export class AppController {
  async getApps(req: Request, res: Response) {
    const apps = await appService.getApps()

    new OK(
      {
        message: 'List of apps',
        metadata: apps
      }
    ).send(res)
  }

  async getApp(req: Request, res: Response) {
    const id = parseInt(req.params.id)
    if (isNaN(Number(id))) throw new BadRequest('Id must be a number')
    const app = await appService.getApp(id)

    if (!app) {
      throw new BadRequest('App not found')
    }

    new OK(
      {
        message: 'App detail',
        metadata: app
      }
    )
  }

  async createApp(req: Request, res: Response) {
    const {name} = createAppSchema.parse(req.body)

    const uploadsDir = join(__dirname, '..', 'uploads', 'apks', name)

    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, {recursive: true})
    }

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

    const app = await appService.createApp({
      name,
      userId: req.user.userId,
      filepath
    })

    new CREATED(
      {
        message: 'App created',
        metadata: app
      }
    ).send(res)
  }

  async updateApp(req: Request, res: Response) {
    const id = parseInt(req.params.id)
    if (isNaN(Number(id))) throw new BadRequest('Id must be a number')

    const app = await appService.getApp(id)

    if (!app) {
      throw new BadRequest('App not found')
    }

    const {name, updated} = updateAppSchema.parse(req.body)

    const file = req.raw?.files?.file

    let filepath;

    if (file && file.file) {
      if (app.filepath) {
        if (existsSync(app.filepath)) {
          // Xóa file cũ
          rimraf.sync(join(__dirname, '..', 'uploads', 'apks', app.name))
        }
      }

      const uploadsDir = join(__dirname, '..', 'uploads', 'apks', name ? name : app.name)

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
    const updatedApp = await appService.updateApp(id, {
      name: name ? name : app.name,
      updated: updated ? updated : app.updated,
      userId: req.user.userId ? req.user.userId : app.userId,
      filepath: filepath ? filepath : app.filepath
    })

    new OK(
      {
        message: 'App updated',
        metadata: updatedApp
      }
    ).send(res)
  }

  async deleteApp(req: Request, res: Response) {
    const id = parseInt(req.params.id)
    if (isNaN(Number(id))) throw new BadRequest('Id must be a number')

    const app = await appService.getApp(id)

    if (!app) {
      throw new BadRequest('App not found')
    }

    if (app.filepath) {
      if (existsSync(app.filepath)) {
        // Xóa file cũ
        rimraf.sync(join(__dirname, '..', 'uploads', 'apks', app.name))
      }
    }

    await appService.deleteApp(id)

    new OK(
      {
        message: 'App deleted',
        metadata: null
      }
    ).send(res)
  }

  async downloadApp(req: Request, res: Response) {
    const id = parseInt(req.params.id)
    if (isNaN(Number(id))) throw new BadRequest('Id must be a number')

    const app = await appService.getApp(id)

    if (!app) {
      throw new BadRequest('App not found')
    }

    if (!app.filepath) {
      throw new BadRequest('File not found')
    }

    const fileStream = createReadStream(app.filepath)

    res.setHeader('Content-Disposition', `attachment; filename="${app.name}".apk`)
    res.setHeader('Content-Type', 'application/octet-stream')

    fileStream.pipe(res)

    // res.download(app.filepath)
  }
}
