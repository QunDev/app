// auth.service.ts
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { RSA_PRIVATE_KEY } from '~/config/keys'
import { AuthRepository } from '~/repositories/auth.repository.ts'
import { hashFunction } from '~/utils'
import { BadRequest, UNAUTHORIZED } from '~/core/error.response.ts'
import { UserRepository } from '~/repositories/user.repository.ts'
import { Role } from '@prisma/client'
import { queueManager } from '~/instances/queueManager.instance.ts'
import { prisma } from '~/utils/prismaClient.ts'
import bcrypt from 'bcrypt'
import { userWithRoole } from '~/types/auth.type.ts'

const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || '1h' // 1 hour

export class AuthService {
  private readonly authRepository: AuthRepository
  private userRepository: UserRepository

  constructor(authRepository: AuthRepository, userRepo: UserRepository) {
    this.authRepository = authRepository
    this.userRepository = userRepo
  }

  async registerUser(data: any) {
    // Gửi job vào queue, hàm handler sẽ thực sự gọi transaction
    return queueManager.enqueue(
      'RegisterUser', // Tên operation
      data, // payload
      async (payload) => {
        // handler: gọi transaction để update DB
        return prisma.$transaction(async (tx) => {
          if (payload.name) {
            const existingUser = await tx.user.findFirst({
              where: {
                email: payload.email
              }
            })

            if (existingUser) {
              throw new BadRequest('Email already exists')
            }
          }

          const hashedPassword = bcrypt.hashSync(payload.password, 12)

          // Tạo User
          const userNew = await tx.user.create({
            data: {
              email: payload.email,
              password: hashedPassword,
              name: payload.name,
              roles: {
                create: {
                  roleId: 2
                }
              }
            },
            select: {
              id: true,
              email: true,
              name: true,
              roles: {
                select: {
                  role: {
                    select: {
                      name: true
                    }
                  }
                }
              }
            }
          })
          return userNew
        })
      }
    )
  }

  async createAccessToken(payload: object): Promise<string> {
    // Ký token bằng privateKey
    // Thuật toán RSA SHA-256
    return jwt.sign(payload, RSA_PRIVATE_KEY, {
      algorithm: 'RS256',
      expiresIn: ACCESS_TOKEN_EXPIRES
    })
  }

  async createRefreshToken(userId: number): Promise<string> {
    const user = await this.userRepository.getUserById(userId)
    if (!user) {
      throw new UNAUTHORIZED('User not found')
    }

    const checkUserTokenRefreshOld = await this.authRepository.getRefreshTokenByUserId(userId)

    if (checkUserTokenRefreshOld) {
      for (let i = 0; i < checkUserTokenRefreshOld.length; i++) {
        if (checkUserTokenRefreshOld[i].isRevoked === false) {
          await this.authRepository.revokeRefreshToken(checkUserTokenRefreshOld[i].tokenHash)
        }
      }
    }

    const refreshPlain = crypto.randomBytes(64).toString('hex')
    const refreshHash = hashFunction(refreshPlain)

    await this.authRepository.createRefreshToken({
      userId,
      tokenHash: refreshHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 ngày
    })

    // 3) Trả về plaintext để client lưu
    return refreshPlain
  }

  async refreshAccessToken(oldRefreshPlain: string): Promise<{ accessToken: string; refreshToken: string }> {
    // 1) Hash refresh token cũ
    const oldHash = hashFunction(oldRefreshPlain)

    // 2) Tìm bản ghi RefreshToken
    const oldToken = await this.authRepository.getRefreshTokenByTokenHash(oldHash)
    if (!oldToken) {
      throw new UNAUTHORIZED('Invalid refresh token (not found in DB).')
    }

    // Kiểm tra đã revoke chưa
    if (oldToken.isRevoked) {
      throw new UNAUTHORIZED('Refresh token revoked.')
    }

    // Kiểm tra hết hạn
    if (oldToken.expiresAt < new Date()) {
      throw new UNAUTHORIZED('Refresh token expired.')
    }

    // 3) Revoke old token
    await this.authRepository.revokeRefreshToken(oldHash)

    const userWithRoles = (await this.userRepository.getUserById(oldToken.userId)) as userWithRoole | null
    if (!userWithRoles) {
      throw new UNAUTHORIZED('User not found')
    }

    const roleNames: string[] = userWithRoles.roles.map((ur: any) => ur.role.name)

    // 4) Tạo accessToken (JWT)
    //    Thường ta gắn payload = { sub: userId, ... } + expiresIn
    const accessToken = await this.createAccessToken({
      sub: oldToken.userId,
      role: roleNames
    })

    // 5) Tạo refreshToken mới
    const newPlain = crypto.randomBytes(64).toString('hex')
    const newHash = hashFunction(newPlain)

    // 6) Lưu refreshToken mới vào DB
    //    Tuỳ bạn đặt thời gian sống (vd: 7 ngày)
    const newExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    await this.authRepository.createRefreshToken({
      userId: oldToken.userId,
      tokenHash: newHash,
      expiresAt: newExpires
    })

    // 7) Trả về accessToken + refreshToken (plaintext)
    return {
      accessToken,
      refreshToken: newPlain
    }
  }
}
