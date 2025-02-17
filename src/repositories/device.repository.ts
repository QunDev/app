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