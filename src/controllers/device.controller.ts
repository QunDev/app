import {DeviceRepository} from "~/repositories/device.repository.ts";
import {DeviceService} from "~/services/device.service.ts";
import {Request, Response} from 'express';
import {createDeviceSchema} from "~/validations/device.validation.ts";
import {CREATED, OK} from "~/core/success.response.ts";
import {UnprocessableEntity} from "~/core/error.response.ts";
import prisma from "~/utils/prismaClient.ts";

const deviceRepository = new DeviceRepository(prisma);
const deviceService = new DeviceService(deviceRepository);

export class DeviceController {
  async getDevices(req: Request, res: Response) {
    const devices = await deviceService.getDevices();
    if (!devices.length) {
      new OK({
        message: 'No devices found',
        metadata: []
      }).send(res);
    }
    new OK({
      message: 'Devices found',
      metadata: devices
    }).send(res);
  }

  async create(req: Request, res: Response) {
    const {deviceId} = createDeviceSchema.parse(req.body);
    const userId = req.user.userId;
    const device = await deviceService.create({userId, deviceId});
    new CREATED({
      message: 'Device created successfully',
      metadata: device
    }).send(res);
  }

  async findByDeviceId(req: Request, res: Response) {
    const {deviceId} = req.params;
    if (!deviceId) throw new UnprocessableEntity('Device ID is required');

    const device = await deviceService.findByDeviceId(deviceId);
    new OK({
      message: 'Device found',
      metadata: device
    }).send(res);
  }

  async updateDevice(req: Request, res: Response) {
    const {deviceId} = req.params;
    const data = req.body;
    if (!deviceId) throw new UnprocessableEntity('Device ID is required');
    const device = await deviceService.updateDevice(deviceId, data);
    new OK({
      message: 'Device updated successfully',
      metadata: device
    }).send(res);
  }

  async updateIsActiveDevice(req: Request, res: Response) {
    const {deviceId} = req.params;
    const is_active = req.query.is_active === 'true';
    if (!deviceId) throw new UnprocessableEntity('Device ID is required');
    const device = await deviceService.updateIsActiveDevice(deviceId, is_active);
    new OK({
      message: 'Done',
      metadata: device
    }).send(res);
  }

  async updateIsUpdateDevice(req: Request, res: Response) {
    const {deviceId} = req.params;
    const is_update = req.query.is_update === 'true';
    if (!deviceId) throw new UnprocessableEntity('Device ID is required');
    const device = await deviceService.updateIsUpdateDevice(deviceId, is_update);
    new OK({
      message: 'Done',
      metadata: device
    }).send(res);
  }

  async updateIsStartDevice(req: Request, res: Response) {
    const {deviceId} = req.params;
    const is_start = req.query.is_start === 'true';
    if (!deviceId) throw new UnprocessableEntity('Device ID is required');
    const device = await deviceService.updateIsStartDevice(deviceId, is_start);
    new OK({
      message: 'Done',
      metadata: device
    }).send(res);
  }

  async updateAllDevicesIsStart(req: Request, res: Response) {
    const is_start = req.query.is_start === 'true';
    const devices = await deviceService.updateAllDevicesIsStart(is_start);
    new OK({
      message: 'Done',
      metadata: devices
    }).send(res);
  }
}