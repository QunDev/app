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

  async getRandomEmailByAppId(appId: number) {
    while (true) {
      // Lấy email có `appId` và sắp xếp theo `updatedAt ASC`
      const email = await this.prisma.email.findFirst({
        where: { appId },
        orderBy: { updatedAt: 'asc' }
      });
      console.log(email ? email.address : 'No email found');

      if (!email) return email; // Không có email nào phù hợp

      // Kiểm tra xem email này có tồn tại trong bảng accountApp hay không
      const existingAccount = await this.prisma.accountApp.findFirst({
        where: { email: email.address, appId }
      });

      if (!existingAccount) {
        console.log(`Found email ${email.address} for appId ${appId}`);
        // Nếu email chưa tồn tại trong bảng accountApp, cập nhật updatedAt và trả về
        await this.prisma.email.update({
          where: { id: email.id },
          data: { updatedAt: new Date() }
        });
        return email;
      }

      // Nếu email đã tồn tại, tiếp tục vòng lặp để lấy email khác
    }
  }
}
