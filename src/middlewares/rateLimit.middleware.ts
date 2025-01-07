import rateLimit from 'express-rate-limit'
import { Request, Response, NextFunction } from 'express'
import { ForbiddenError } from '~/core/error.response.ts'

const apiKeyRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each API key to 100 requests per windowMs
  keyGenerator: (req: Request) => req.headers['x-api-key'] as string,
  handler: (req: Request, res: Response, next: NextFunction) => {
    next(new ForbiddenError('Too many requests, please try again later.'))
  }
})

export default apiKeyRateLimiter
