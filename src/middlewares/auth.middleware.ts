// auth.middleware.ts
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { RSA_PUBLIC_KEY } from '~/config/keys'
import { asyncHandler } from '~/helper/errorHandle.ts'
import { UNAUTHORIZED } from '~/core/error.response.ts'
import { userWithRoole } from '~/types/auth.type.ts'

export const requireAuth = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    throw new UNAUTHORIZED('No authorization')
  }
  const token = authHeader.replace('Bearer ', '').trim()

  // Xác thực token
  // Lưu decoded vào req
  req.user = jwt.verify(token, RSA_PUBLIC_KEY, {
    algorithms: ['RS256']
  }) as userWithRoole
  next()
  return
})
