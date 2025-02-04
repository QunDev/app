import { PrismaClient } from '@prisma/client'

export class EmailRepository {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async getEmails() {
    return this.prisma.email.findMany()
  }

  async getEmailById(id: number) {
    return this.prisma.email.findUnique({ where: { id } })
  }

  async getEmailsByAddresses(addresses: string[]) {
    return this.prisma.email.findMany({
      where: { address: { in: addresses } }
    })
  }

  async createEmails(data: any[]) {
    return this.prisma.email.createMany({ data })
  }

  async updateEmail(id: number, data: any) {
    return this.prisma.email.update({ where: { id }, data })
  }

  async deleteEmail(id: number) {
    return this.prisma.email.delete({ where: { id } })
  }

  async deleteAllEmails() {
    return this.prisma.email.deleteMany()
  }

  async getRandomEmail() {
    const email = await this.prisma.email.findFirst({
      orderBy: { updatedAt: 'asc' }
    });

    if (email) {
      await this.prisma.email.update({
        where: { id: email.id },
        data: { updatedAt: new Date() }
      });
    }

    return email;
  }
}
