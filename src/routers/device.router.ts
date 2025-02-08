import express from "express";
import {asyncHandler} from "~/helper/errorHandle.ts";
import {DeviceController} from "~/controllers/device.controller.ts";

const router = express();

const deviceController = new DeviceController();

router.get('/', asyncHandler(deviceController.getDevices));
router.get('/active', asyncHandler(deviceController.updateIsActiveDevice));
router.get('/:deviceId', asyncHandler(deviceController.findByDeviceId));
router.post('/', asyncHandler(deviceController.create));
router.put('/:deviceId', asyncHandler(deviceController.updateDevice));

export default router;