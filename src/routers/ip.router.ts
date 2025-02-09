import express from "express";
import { IpController } from "~/controllers/ip.controller.ts";
import { asyncHandler } from "~/helper/errorHandle.ts";

const router = express.Router();
const ipController = new IpController();

router.get("/", asyncHandler(ipController.getAllIps));
router.get("/check/:appId/:ip", asyncHandler(ipController.checkIpUsage));
router.get("/:id", asyncHandler(ipController.getIpById));
router.post("/", asyncHandler(ipController.createIp));
router.put("/:id", asyncHandler(ipController.updateIp));
router.delete("/:id", asyncHandler(ipController.deleteIp));

export default router;
