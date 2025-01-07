import express from 'express'
import {PhoneController} from "~/controllers/phone.controller.ts";
import {asyncHandler} from "~/helper/errorHandle.ts";

const router = express.Router()

const phoneController = new PhoneController()

router.get('/', asyncHandler(phoneController.getPhones))
router.get('/:id', asyncHandler(phoneController.getPhone))
router.get('/random/:appId', asyncHandler(phoneController.getRandomPhoneByAppId))
router.post('/', asyncHandler(phoneController.createPhones))
router.put('/updateAppId', asyncHandler(phoneController.updateAppIdAllPhones)) // New route for bulk update
router.put('/', asyncHandler(phoneController.updatePhones)) // New route for bulk update
router.put('/:id', asyncHandler(phoneController.updatePhone))
router.delete('/:id', asyncHandler(phoneController.deletePhone))
router.delete('/', asyncHandler(phoneController.deleteAllPhones))

export default router
