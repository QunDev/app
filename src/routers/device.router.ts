import express from "express";
import {asyncHandler} from "~/helper/errorHandle.ts";
import {DeviceController} from "~/controllers/device.controller.ts";

const router = express();

const deviceController = new DeviceController();

router.get('/:deviceId', asyncHandler(deviceController.findByDeviceId));
router.post('/', asyncHandler(deviceController.create));

export default router;