import {Backup, PrismaClient} from '@prisma/client'

export class BackupRepository {
  private readonly prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = new PrismaClient()
  }

  async getBackups() {
    return this.prisma.backup.findMany()
  }

  async getBackupById(id: number) {
    return this.prisma.backup.findUnique({ where: { id } })
  }

  async createBackup(data: Pick<Backup, 'userId' | 'appId' | 'description' | 'filename' | 'filepath' | 'filesize'>) {
    return this.prisma.backup.create({ data })
  }

  async updateBackup(id: number, data: any) {
    return this.prisma.backup.update({ where: { id }, data })
  }

  async deleteBackup(id: number) {
    return this.prisma.backup.delete({ where: { id } })
  }

  async getBackupByFilename(filename: string) {
    return this.prisma.backup.findFirst({ where: { filename } })
  }
}