import { Request, Response, NextFunction } from 'express';
import * as countryPhoneService from '~/services/countryPhone.service.ts';
import { OK, CREATED } from '~/core/success.response.ts';
import {asyncHandler} from "~/helper/errorHandle.ts";

export const getCountryPhones = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const countryPhones = await countryPhoneService.getAllCountryPhones();
    new OK({ message: 'Country phones retrieved successfully', metadata: countryPhones }).send(res);
  } catch (error) {
    next(error);
  }
};

export const getCountryPhone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const countryPhone = await countryPhoneService.getCountryPhone(Number(req.params.id));
    new OK({ message: 'Country phone retrieved successfully', metadata: countryPhone }).send(res);
  } catch (error) {
    next(error);
  }
};

export const createCountryPhone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newCountryPhone = await countryPhoneService.createNewCountryPhone(req.body);
    new CREATED({ message: 'Country phone created successfully', metadata: newCountryPhone }).send(res);
  } catch (error) {
    next(error);
  }
};

export const updateCountryPhone =asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedCountryPhone = await countryPhoneService.updateExistingCountryPhone(Number(req.params.id), req.body);
    new OK({ message: 'Country phone updated successfully', metadata: updatedCountryPhone }).send(res);
  } catch (error) {
    next(error);
  }
});

export const deleteCountryPhone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await countryPhoneService.removeCountryPhone(Number(req.params.id));
    new OK({ message: 'Country phone deleted successfully', metadata:undefined }).send(res);
  } catch (error) {
    next(error);
  }
};