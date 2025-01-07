import express from 'express'
import {AppController} from '~/controllers/app.controller.ts'
import {asyncHandler} from "~/helper/errorHandle.ts";

const appController = new AppController();

const router = express.Router()

router.get('/', asyncHandler(appController.getApps))
router.get('/:id', asyncHandler(appController.getApp))
router.post('/', asyncHandler(appController.createApp))
router.put('/:id', asyncHandler(appController.updateApp))
router.delete('/:id', asyncHandler(appController.deleteApp))

export default router
