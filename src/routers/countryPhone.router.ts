import express from 'express'
import {CountryPhoneController} from "~/controllers/countryPhone.controller.ts";
import {asyncHandler} from "~/helper/errorHandle.ts";

const router = express.Router()

const countryPhoneController = new CountryPhoneController()

router.get('/', asyncHandler(countryPhoneController.getCountryPhones))
router.get('/:id', asyncHandler(countryPhoneController.getCountryPhone))
router.post('/', asyncHandler(countryPhoneController.createCountryPhone))
router.put('/:id', asyncHandler(countryPhoneController.updateCountryPhone))
router.delete('/:id', asyncHandler(countryPhoneController.deleteCountryPhone))

export default router
