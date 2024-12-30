import express from "express";
import phoneController from "~/controllers/phone.controller.ts";
import {validateCreatePhone} from "~/middlewares/phone.middleware.ts";
import {asyncHandler} from "~/helper/errorHandle.ts";

const router = express.Router();

router.post('/cphone', validateCreatePhone, asyncHandler(phoneController.addPhones));
router.get('/random', asyncHandler(phoneController.getRandomPhone));

export default router;