import {DeviceRepository} from "~/repositories/device.repository.ts";
import {device} from "@prisma/client";

export class DeviceService {
  private readonly deviceRepository: DeviceRepository

  constructor(deviceRepository: DeviceRepository) {
    this.deviceRepository = deviceRepository
  }

  async getDevices() {
    return this.deviceRepository.getDevices()
  }

  async create(data: Pick<device, 'userId' | 'deviceId'>) {
    return this.deviceRepository.create(data)
  }

  async findByDeviceId(deviceId: string) {
    return this.deviceRepository.findByDeviceId(deviceId)
  }
}