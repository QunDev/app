import { PrismaClient } from '@prisma/client'

export class PhoneRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async getPhones() {
    return this.prisma.phone.findMany()
  }

  async getPhoneById(id: number) {
    return this.prisma.phone.findUnique({ where: { id } })
  }

  async getPhoneByNumber(number: string) {
    return this.prisma.phone.findFirst({ where: { number } })
  }

  async createPhones(data: any[]) {
    return this.prisma.phone.createMany({ data })
  }

  async updatePhone(id: number, data: any) {
    return this.prisma.phone.update({ where: { id }, data })
  }

  async deletePhone(id: number) {
    return this.prisma.phone.delete({ where: { id } })
  }

  async deleteAllPhones() {
    return this.prisma.phone.deleteMany()
  }

  async getRandomPhoneByAppId(appId: number) {
    const phone = await this.prisma.phone.findFirst({
      where: { appId },
      orderBy: { updatedAt: 'asc' }
    })

    if (phone) {
      const update = await this.prisma.phone.update({
        where: { id: phone.id },
        data: { updatedAt: new Date() }
      })
    }

    return phone
  }

  async updatePhones(data: { id: number; updateData: any }[]) {
    const updatePromises = data.map((phone) =>
      this.prisma.phone.update({
        where: { id: phone.id },
        data: phone.updateData
      })
    )
    return Promise.all(updatePromises)
  }

  async updateAppIdAllPhones(appId: number, phoneIds: number[]) {
    const batchSize = 1000 // Kích thước mỗi lô
    const totalBatches = Math.ceil(phoneIds.length / batchSize)

    for (let i = 0; i < totalBatches; i++) {
      const batch = phoneIds.slice(i * batchSize, (i + 1) * batchSize)
      await this.prisma.phone.updateMany({
        where: {
          id: {
            in: batch
          }
        },
        data: {
          appId
        }
      })
    }
  }
}