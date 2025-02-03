import {ApiKey} from '@prisma/client'
import {PrismaService} from "~/prisma/prisma.service.ts";

export class ApiKeyRepository {
  private readonly prisma: PrismaService

  constructor(prisma: PrismaService) {
    this.prisma = prisma
  }

  async createApiKey(data: Pick<ApiKey, 'key'>): Promise<ApiKey> {
    return this.prisma.apiKey.create({data})
  }

  async getApiKeyByKey(key: string): Promise<Pick<ApiKey, 'userId' | 'status'> | null> {
    return this.prisma.apiKey.findUnique({
      where: {key},
      select: {userId: true, status: true}
    })
  }

  async revokeApiKey(key: string): Promise<ApiKey> {
    return this.prisma.apiKey.update({where: {key}, data: {status: 'REVOKED'}})
  }
}