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

  async updateDevice(deviceId: string, data: Partial<device>) {
    return this.deviceRepository.updateDevice(deviceId, data)
  }

  async updateIsActiveDevice(deviceId: string, is_active: boolean) {
    return this.deviceRepository.updateIsActiveDevice(deviceId, is_active)
  }

  async updateIsUpdateDevice(deviceId: string, is_update: boolean) {
    return this.deviceRepository.updateIsUpdateDevice(deviceId, is_update)
  }

  async updateIsStartDevice(deviceId: string, is_start: boolean) {
    return this.deviceRepository.updateIsStartDevice(deviceId, is_start)
  }

  async updateAllDevicesIsStart(is_start: boolean) {
    return this.deviceRepository.updateAllDevicesIsStart(is_start)
  }
}