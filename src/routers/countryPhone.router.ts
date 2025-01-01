import express from 'express';
import * as countryPhoneController from '~/controllers/countryPhone.controller.ts';
import { validate } from '~/middlewares/validation.middleware.ts';
import { createCountryPhoneSchema, updateCountryPhoneSchema } from '~/validations/countryPhone.validation.ts';

const router = express.Router();

router.get('/', countryPhoneController.getCountryPhones);
router.get('/:id', countryPhoneController.getCountryPhone);
router.post('/', validate(createCountryPhoneSchema), countryPhoneController.createCountryPhone);
router.put('/:id', validate(updateCountryPhoneSchema), countryPhoneController.updateCountryPhone);
router.delete('/:id', countryPhoneController.deleteCountryPhone);

export default router;