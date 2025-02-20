import {PrismaService} from "~/prisma/prisma.service.ts";
import {App} from "@prisma/client";

export class AppRepository {
  private readonly prisma: PrismaService

  constructor(prisma: PrismaService) {
    this.prisma = prisma
  }

  async getAllApps() {
    return this.prisma.app.findMany(
      {
        select: {
          id: true,
          name: true,
          filepath: true,
          createdAt: true,
          updatedAt: true
        }
      }
    )
  }

  async getApp(id: number) {
    return this.prisma.app.findUnique({
      where: {id},
      select: {
        id: true,
        name: true,
        filepath: true,
        version: true,
        createdAt: true,
        updatedAt: true,
        userId: true
      }
    })
  }

  async getAppByName(name: string) {
    return this.prisma.app.findFirst({where: {name}})
  }

  async createNewApp(data: Pick<App, 'name' | 'userId' | 'filepath'>): Promise<App> {
    return this.prisma.app.create({data})
  }

  async updateExistingApp(id: number, data: Partial<App>): Promise<App> {
    return this.prisma.app.update({where: {id}, data})
  }

  async removeApp(id: number) {
    return this.prisma.app.delete({where: {id}})
  }
}