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
      include: {
        countryPhones: {
          select: {
            countryPhone: {
              select: {
                country: true,
                numberCode: true
              }
            }
          }
        },
        apps: {
          select: {
            app: {
              select: {
                id: true,
                name: true
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

  async updateIsActiveDevice(deviceId: string, is_active: boolean) {
    return this.prisma.device.update({where: {deviceId}, data: {is_active}})
  }

  async updateIsUpdateDevice(deviceId: string, is_update: boolean) {
    return this.prisma.device.update({where: {deviceId}, data: {is_update}})
  }

  async updateIsStartDevice(deviceId: string, is_start: boolean) {
    return this.prisma.device.update({where: {deviceId}, data: {is_start}})
  }

  async updateAllDevicesIsStart(is_start: boolean) {
    return this.prisma.device.updateMany({data: {is_start}})
  }
}