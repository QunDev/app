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
}