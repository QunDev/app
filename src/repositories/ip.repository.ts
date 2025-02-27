import { PrismaClient } from "@prisma/client";

export class IpRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAllIps() {
    return this.prisma.ip.findMany();
  }

  async getIpById(id: number) {
    return this.prisma.ip.findUnique({ where: { id } });
  }

  async getIpByAddress(ip: string, appId: number) {
    return this.prisma.ip.findFirst({ where: { ip, appId } });
  }

  async createIp(data: any) {
    return this.prisma.ip.create({ data });
  }

  async updateIp(id: number, data: any) {
    return this.prisma.ip.update({ where: { id }, data });
  }

  async deleteIp(id: number) {
    return this.prisma.ip.delete({ where: { id } });
  }

  async checkIpUsage(ip: string, appId: number) {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    return this.prisma.ip.findFirst({
      where: {
        ip,
        appId,
        countUsed: {
          gte: 5,
        },
        lastUsed: {
          gte: oneDayAgo,
        },
      },
    });
  }

  async incrementIpCount(ip: string, appId: number) {
    const ipRecord = await this.prisma.ip.findFirst({
      where: { ip, appId },
    });

    if (!ipRecord) {
      throw new Error('Không tìm thấy bản ghi IP');
    }

    return this.prisma.ip.update({
      where: { id: ipRecord.id },
      data: {
        countUsed: {
          increment: 1,
        },
        lastUsed: new Date(),
      },
    });
  }
}

