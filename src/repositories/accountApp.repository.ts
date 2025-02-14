import {accountApp} from '@prisma/client'
import {PrismaService} from '~/prisma/prisma.service'

export class AccountAppRepository {
  private readonly prisma: PrismaService

  constructor(prisma: PrismaService) {
    this.prisma = prisma
  }

  async getAllAccountApps(appId?: number): Promise<accountApp[]> {
    const whereClause = appId ? { appId } : {};
    return this.prisma.accountApp.findMany({ where: whereClause });
  }

  async createAccountApp(data: Pick<accountApp, 'userId' | 'appId'>): Promise<accountApp> {
    return this.prisma.accountApp.create({
      data
    })
  }

  async createAccountAppMany(data: Pick<accountApp, 'userId' | 'appId'>[]) {
    return this.prisma.accountApp.createMany({
      data
    })
  }

  async getAccountAppById(id: number): Promise<accountApp | null> {
    return this.prisma.accountApp.findUnique({
      where: {id}
    })
  }

  async updateAccountApp(id: number, data: Partial<accountApp>): Promise<accountApp> {
    return this.prisma.accountApp.update({
      where: {id},
      data
    })
  }

  async deleteAccountApp(id: number): Promise<accountApp> {
    return this.prisma.accountApp.delete({
      where: {id}
    })
  }

  async getAccountAppWhereSmsIsNull(appId: number, userId: number): Promise<accountApp | null> {
    return this.prisma.accountApp.findFirst({
      where: {
        userId,
        appId,
        sms: null
      }
    })
  }
}
