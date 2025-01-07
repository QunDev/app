import express, { Request, Response, NextFunction } from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
import { ErrorResponse, NotFoundError } from '~/core/error.response.ts'
import routerIndex from '~/routers'
import { errorHandler } from '~/helper/errorHandle.ts'
import { handleFile } from '~/middlewares/handleFile.ts'

const app = express()

// Init Middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json({ limit: '500mb' }))
app.use(express.urlencoded({ extended: true }))

// Middleware to handle multipart/form-data
app.use(handleFile)

// Init Routes
app.use('/api/v1', routerIndex)

// Error Handler
app.use(errorHandler)

app.use((req, res, next) => {
  const error = new NotFoundError()
  next(error)
})

app.use((err: ErrorResponse, req: Request, res: Response, next: NextFunction): void => {
  const statusCode = err.status || 500
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    details: err.details || undefined
  })
  return
})

export default app
