import {device, PrismaClient} from "@prisma/client";

export class DeviceRepository {
  private readonly prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async getDevices() {
    return this.prisma.device.findMany();
  }

  async create(data: Pick<device, 'userId' | 'deviceId'>) {
    return this.prisma.device.create({data})
  }

  async findByDeviceId(deviceId: string) {
    return this.prisma.device.findUnique({
      where: {deviceId},
      select: {
        countryPhones: {
          select: {
            device: {
              select: {
                name: true,
                proxy: true,
                wifi: true,
                passwordWifi: true,
                deviceId: true,
                userId: true,
                is_active: true,
                is_online: true,
                is_start: true,
                lastOnline: true,
                createdAt: true,
              }
            },
            countryPhone: {
              select: {
                country: true,
                numberCode: true
              }
            }
          }
        }
      }
    })
  }

  async updateDevice(deviceId: string, data: Partial<device>) {
    return this.prisma.device.update({where: {deviceId}, data})
  }

  async updateIsActiveDevice(deviceId
                             :
                             string
  ) {
    return this.prisma.device.update({where: {deviceId}, data: {is_active: true}})
  }
}