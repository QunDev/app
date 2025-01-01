import express from 'express';
import * as phoneController from '~/controllers/phone.controller.ts';
import { validate } from '~/middlewares/validation.middleware.ts';
import { createPhoneSchema, updatePhoneSchema } from '~/validations/phone.validation.ts';

const router = express.Router();

router.get('/', phoneController.getPhones);
router.get('/:id', phoneController.getPhone);
router.get('/random/:appId', phoneController.getRandomPhoneByAppId);
router.post('/', validate(createPhoneSchema), phoneController.createPhones);
router.put('/updateAppId', phoneController.updateAppIdAllPhones); // New route for bulk update
router.put('/', phoneController.updateMultiplePhones); // New route for bulk update
router.put('/:id', validate(updatePhoneSchema), phoneController.updatePhone);
router.delete('/:id', phoneController.deletePhone);
router.delete('/', phoneController.deleteAllPhones);

export default router;