import { Request, Response, NextFunction } from 'express'
import { getApiKeyByKey } from '~/repositories/apiKey.repository.ts'
import { ForbiddenError } from '~/core/error.response.ts'
import {asyncHandler} from "~/helper/errorHandle.ts";

export const apiKeyAuthMiddleware = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = (req.headers['x-api-key'] as string) || req.query.apikey

  if (!apiKey) {
    return next(new ForbiddenError('API key is missing'))
  }

  const validApiKey = await getApiKeyByKey(apiKey)

  if (!validApiKey || validApiKey.status !== 'ACTIVE') {
    return next(new ForbiddenError('Invalid or inactive API key'))
  }

  req.apiKey = validApiKey
  next()
})
