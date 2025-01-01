import { Request, Response, NextFunction } from 'express';
import * as appService from '~/services/app.service.ts';
import { OK, CREATED } from '~/core/success.response.ts';
import { asyncHandler } from '~/helper/errorHandle.ts';

export const getApps = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const apps = await appService.getAllApps();
  new OK({ message: 'Apps retrieved successfully', metadata: apps }).send(res);
});

export const getApp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const app = await appService.getApp(Number(req.params.id));
  new OK({ message: 'App retrieved successfully', metadata: app }).send(res);
});

export const createApp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const newApp = await appService.createNewApp(req.body);
  new CREATED({ message: 'App created successfully', metadata: newApp }).send(res);
});

export const updateApp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const updatedApp = await appService.updateExistingApp(Number(req.params.id), req.body);
  new OK({ message: 'App updated successfully', metadata: updatedApp }).send(res);
});

export const deleteApp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  await appService.removeApp(Number(req.params.id));
  new OK({ message: 'App deleted successfully' }).send(res);
});