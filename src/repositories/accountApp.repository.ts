import {accountApp} from '@prisma/client'
import {PrismaService} from '~/prisma/prisma.service'

export class AccountAppRepository {
  private readonly prisma: PrismaService

  constructor(prisma: PrismaService) {
    this.prisma = prisma
  }

  async getAllAccountApps(): Promise<accountApp[]> {
    return this.prisma.accountApp.findMany()
  }

  async createAccountApp(data: Pick<accountApp, 'userId' | 'appId'>): Promise<accountApp> {
    return this.prisma.accountApp.create({
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
}
