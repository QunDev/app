import { PrismaClient } from '@prisma/client'

export class CountryPhoneRepository {
  private readonly prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = new PrismaClient()
  }

  async getCountryPhones() {
    return this.prisma.countryPhone.findMany()
  }

  async getCountryPhoneById(id: number) {
    return this.prisma.countryPhone.findUnique({ where: { id } })
  }

  async getCountryPhoneByNumberCode(numberCode: string) {
    return this.prisma.countryPhone.findFirst({ where: { numberCode } })
  }

  async createCountryPhone(data: any) {
    return this.prisma.countryPhone.create({ data })
  }

  async updateCountryPhone(id: number, data: any) {
    return this.prisma.countryPhone.update({ where: { id }, data })
  }

  async deleteCountryPhone(id: number) {
    return this.prisma.countryPhone.delete({ where: { id } })
  }
}