import { Request, Response, NextFunction } from 'express';
import * as phoneService from '~/services/phone.service.ts';
import { OK, CREATED } from '~/core/success.response.ts';
import { asyncHandler } from '~/helper/errorHandle.ts';

export const getPhones = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const phones = await phoneService.getAllPhones();
  new OK({ message: 'Phones retrieved successfully', metadata: phones }).send(res);
});

export const getPhone = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const phone = await phoneService.getPhone(Number(req.params.id));
  new OK({ message: 'Phone retrieved successfully', metadata: phone }).send(res);
});

export const createPhones = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { numbers, countryPhoneId, userId } = req.body;
  const newPhones = await phoneService.createNewPhones({ data: numbers, countryPhoneId, userId });
  new CREATED({ message: 'Phones created successfully', metadata: newPhones }).send(res);
});

export const updatePhone = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const updatedPhone = await phoneService.updateExistingPhone(Number(req.params.id), req.body);
  new OK({ message: 'Phone updated successfully', metadata: updatedPhone }).send(res);
});

export const deletePhone = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  await phoneService.removePhone(Number(req.params.id));
  new OK({ message: 'Phone deleted successfully', metadata: undefined }).send(res);
});

export const deleteAllPhones = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  await phoneService.removeAllPhones();
  new OK({ message: 'All phones deleted successfully', metadata: undefined }).send(res);
});

export const getRandomPhoneByAppId = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { appId } = req.params;
  const phone = await phoneService.getRandomPhoneByAppId(Number(appId));
  new OK({ message: 'Phone retrieved successfully', metadata: phone }).send(res);
});

export const updateMultiplePhones = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const {data} = req.body;
  const updateResults = await phoneService.updateMultiplePhones(data);
  new OK({ message: 'Phones updated successfully', metadata: updateResults }).send(res);
});

export const updateAppIdAllPhones = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { appId, phoneIds } = req.body;
  await phoneService.updateAppIdAllPhones(Number(appId), phoneIds);
  new OK({ message: 'Phones updated successfully', metadata: undefined }).send(res);
});