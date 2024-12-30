import express from 'express';
import {asyncHandler} from "~/helper/errorHandle.ts";
import AppController from "~/controllers/app.controller.ts";
import {validateCreateApp} from "~/middlewares/app.middleware.ts";

const router = express.Router();

router.post('/capp', validateCreateApp, asyncHandler(AppController.create));

export default router;