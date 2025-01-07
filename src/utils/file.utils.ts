import { extname } from 'path'

const ALLOWED_FILE_TYPES = ['.tar.gz', '.apk']
const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500 MB

export const sanitizeFilename = (filename: string) => filename.replace(/[^a-zA-Z0-9.\-_]/g, '_')

export const validateFileTypeAndSize = (fileInfo: { filename: string; size: number }) => {
  const fileName = sanitizeFilename(fileInfo.filename)
  const fileExtension = extname(fileInfo.filename)
  const fileSizeIsValid = fileInfo.size <= MAX_FILE_SIZE

  return { fileExtension, fileSizeIsValid, fileName }
}
