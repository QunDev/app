import express from "express";
import {validateCreateCountryPhone} from "~/middlewares/countryPhone.middleware.ts";
import CountryPhoneController from "~/controllers/countryPhone.controller.ts";
import {asyncHandler} from "~/helper/errorHandle.ts";

const router = express.Router();

router.post('/ccountryPhone', validateCreateCountryPhone, asyncHandler(CountryPhoneController.create));

export default router;