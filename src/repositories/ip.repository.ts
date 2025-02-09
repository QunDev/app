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

  async getIpByAddress(ip: string) {
    return this.prisma.ip.findUnique({ where: { ip } });
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

  async checkIpUsage(ip: string) {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    return this.prisma.ip.findFirst({
      where: {
        ip,
        countUsed: {
          gte: 5,
        },
        lastUsed: {
          gte: oneDayAgo,
        },
      },
    });
  }

  async incrementIpCount(ip: string) {
    return this.prisma.ip.update({
      where: { ip },
      data: {
        countUsed: {
          increment: 1,
        },
        lastUsed: new Date(),
      },
    });
  }
}

