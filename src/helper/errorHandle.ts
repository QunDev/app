import { Request, Response, NextFunction } from 'express'
import { BadRequest, InternalServerError, UnprocessableEntity } from '~/core/error.response.ts'
import { z } from 'zod'
import {
  PrismaClientKnownRequestError,
  PrismaClientInitializationError,
  PrismaClientValidationError
} from '@prisma/client/runtime/library'
import statusCodes from '~/utils/statusCodes.ts'
import reasonPhrases from '~/utils/reasonPhrases.ts'

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

/**
 * Global error-handling middleware for catching and handling errors.
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Handle ValidationError or ErrorResponse
  if (err instanceof z.ZodError) {
    const validationErrors = err.errors.map((error) => {
      const field = error.path.join('.')
      return `Field '${field}' - ${error.message}`
    })
    throw new UnprocessableEntity(validationErrors.join(', '))
  }

  if (err instanceof PrismaClientKnownRequestError) {
    let errorMessage = 'Database request error.'
    if (err.code === 'P2002') {
      errorMessage = reasonPhrases.CONFLICT
    } else if (err.code === 'P2025') {
      errorMessage = reasonPhrases.NOT_FOUND
    }
    throw new BadRequest(errorMessage)
  }

  // Handle PrismaClientKnownRequestError
  if (err instanceof PrismaClientInitializationError) {
    throw new InternalServerError('Database connection error. Please ensure the database server is running.')
  }

  // Handle PrismaClientValidationError
  if (err instanceof PrismaClientValidationError) {
    throw new BadRequest('Invalid database query. Please check your input.', statusCodes.BAD_REQUEST, err.message)
  }

  if (err instanceof UnprocessableEntity) {
    throw new BadRequest(err.message)
  }

  throw new InternalServerError(err.message || 'Something went wrong')
}
