import 'express'
import { userWithRoole } from '~/types/auth.type.ts'

declare global {
  namespace Express {
    interface Request {
      user: userWithRoole
    }
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    raw?: {
      files?: {
        file?: {
          filename: string
          file: NodeJS.ReadableStream
          size: number
        }
      }
    }
  }
}

export {}
