import { PrismaService } from '~/prisma/prisma.service.ts'
import { RefreshToken } from '@prisma/client'

export class AuthRepository {
  private readonly prisma: PrismaService

  constructor(prisma: PrismaService) {
    this.prisma = prisma
  }

  async getRefreshTokenByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    return this.prisma.refreshToken.findUnique({
      where: { tokenHash }
    })
  }

  async createRefreshToken(data: Pick<RefreshToken, 'userId' | 'tokenHash' | 'expiresAt'>): Promise<RefreshToken> {
    return this.prisma.refreshToken.create({ data })
  }

  async revokeRefreshToken(tokenHash: string): Promise<RefreshToken> {
    return this.prisma.refreshToken.update({
      where: { tokenHash },
      data: { isRevoked: true }
    })
  }

  async getRefreshTokenByUserId(userId: number): Promise<RefreshToken[] | null> {
    return this.prisma.refreshToken.findMany({
      where: { userId }
    })
  }
}
