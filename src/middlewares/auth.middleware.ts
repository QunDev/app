// auth.middleware.ts
import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import {RSA_PUBLIC_KEY} from '~/config/keys'
import {asyncHandler} from '~/helper/errorHandle.ts'
import {UNAUTHORIZED} from '~/core/error.response.ts'
import {userWithRoole} from '~/types/auth.type.ts'
import {ApiKeyRepository} from "~/repositories/apiKey.repository.ts";
import prisma from "~/utils/prismaClient.ts";

const apiKeyRepository = new ApiKeyRepository(prisma)

export const requireAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  const apiKey = (req.headers['x-api-key'] as string) || req.query.apikey as string
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '').trim()

    // Xác thực token
    // Lưu decoded vào req
    req.user = jwt.verify(token, RSA_PUBLIC_KEY, {
      algorithms: ['RS256']
    }) as userWithRoole
    next()
    return
  }
  if (apiKey) {
    const validApiKey = await apiKeyRepository.getApiKeyByKey(apiKey)

    if (!validApiKey || validApiKey.status !== 'ACTIVE') {
      throw new UNAUTHORIZED('Invalid or inactive API key')
    }

    if (validApiKey.userId) {
      req.user = {
        userId: validApiKey.userId,
      } as userWithRoole;
      next()
      return
    }
  }
  throw new UNAUTHORIZED('No authorization')
})
