import { Request, Response, NextFunction } from 'express';
import * as backupService from '~/services/backup.service.ts';
import { OK, CREATED } from '~/core/success.response.ts';
import { asyncHandler } from '~/helper/errorHandle.ts';
import { existsSync, mkdirSync, statSync, createReadStream } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import {validateFileTypeAndSize} from "~/utils/file.utils.ts";
import {fileProcessing} from "~/helper/fileProcessingQueue.helper.ts";
import {BadRequest} from "~/core/error.response.ts";
import {getApp, getAppByName} from "~/services/app.service.ts";

export const getBackups = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const backups = await backupService.getAllBackups();
  new OK({ message: 'Backups retrieved successfully', metadata: backups }).send(res);
});

export const getBackup = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const backup = await backupService.getBackup(Number(req.params.id));
  new OK({ message: 'Backup retrieved successfully', metadata: backup }).send(res);
});

// export const createBackup = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//   const { appId, description } = req.body;
//   const file = req.raw?.files?.file;
//
//   if (!file || !file.file) {
//     throw new Error('File is required');
//   }
//
//   const uploadsDir = join(__dirname, '..', 'uploads');
//
//   // Kiểm tra và tạo thư mục nếu chưa tồn tại
//   if (!existsSync(uploadsDir)) {
//     mkdirSync(uploadsDir, { recursive: true });
//   }
//
//   // Kiểm tra nếu `uploadsDir` là file (không phải thư mục)
//   const uploadsDirStat = statSync(uploadsDir);
//   if (!uploadsDirStat.isDirectory()) {
//     throw new Error(`Path ${uploadsDir} is not a directory`);
//   }
//
//   // Chuẩn hóa tên file
//   const sanitizeFilename = (filename: string) => filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
//   const fileExtension = extname(file.filename);
//   const filename = `${uuidv4()}${fileExtension}`;
//   const filepath = join(uploadsDir, filename);
//
//   // Log đường dẫn file
//   console.log(`Filepath: ${filepath}`);
//
//   // Chuyển Buffer thành ReadableStream
//   const bufferStream = new Readable();
//   bufferStream.push(file.file);
//   bufferStream.push(null);
//
//   // Ghi file bằng pipeline
//   await pump(bufferStream, createWriteStream(filepath));
//
//   // Tạo backup trong cơ sở dữ liệu
//   const newBackup = await backupService.createNewBackup({
//     filename,
//     filepath,
//     filesize: file.size,
//     appId: Number(appId),
//     description,
//   });
//
//   new CREATED({ message: 'Backup created successfully', metadata: newBackup }).send(res);
// });

export const createBackup = asyncHandler(async (req: Request, res: Response) => {
  const { appId, description, userId } = req.body;
  const app = await getApp(Number(appId));
  if (!app) {
    throw new BadRequest('App not found');
  }

  const uploadsDir = join(__dirname, '..', 'uploads', 'backups', app.name);

  // Kiểm tra và tạo thư mục nếu chưa tồn tại
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
  }

  // Kiểm tra nếu `uploadsDir` là thư mục
  const uploadsDirStat = statSync(uploadsDir);
  if (!uploadsDirStat.isDirectory()) {
    throw new Error(`Path ${uploadsDir} is not a directory`);
  }

  const file = req.raw?.files?.file;

  if (!file || !file.file) {
    throw new Error('File is required');
  }

  // Kiểm tra loại và kích thước file
  const { fileExtension, fileSizeIsValid, fileName } = validateFileTypeAndSize({ filename: file.filename, size: file.size });

  if (!fileSizeIsValid) {
    throw new BadRequest('File size exceeds limit');
  }

  if (!fileExtension) {
    throw new BadRequest('Invalid file type');
  }

  // Tạo tên file an toàn
  const filename = `${uuidv4()}-${fileName}`;
  const filepath = join(uploadsDir, filename);

  // Thêm vào hàng đợi xử lý file
  await fileProcessing({ buffer: file.file, filepath });

  // Tạo backup trong cơ sở dữ liệu
  const newBackup = await backupService.createNewBackup({
    filename,
    filepath,
    filesize: file.size,
    appId: Number(appId),
    description,
    userId: Number(userId),
  });

  new CREATED({ message: 'Backup created successfully', metadata: newBackup }).send(res);
});

export const updateBackup = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const updatedBackup = await backupService.updateExistingBackup(Number(req.params.id), req.body);
  new OK({ message: 'Backup updated successfully', metadata: updatedBackup }).send(res);
});

export const deleteBackup = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  await backupService.removeBackup(Number(req.params.id));
  new OK({ message: 'Backup deleted successfully', metadata: undefined }).send(res);
});

export const downloadBackup = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { filename } = req.params;
  const { appname } = req.query;

  const app = await getAppByName(appname as string);

  if (!app) {
    throw new BadRequest('App not found');
  }

  const backup = await backupService.getBackupByFilename(filename);

  if (!backup) {
    throw new Error('Backup not found');
  }

  const filepath = join(__dirname, '..', 'uploads', 'backups', app.name, backup.filename);
  const fileStream = createReadStream(filepath);

  res.setHeader('Content-Disposition', `attachment; filename="${backup.filename}"`);
  res.setHeader('Content-Type', 'application/octet-stream');

  fileStream.pipe(res);
});