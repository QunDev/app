import * as appRepository from '~/repositories/app.repository.ts';
import { ConflictError, NotFoundError, UnprocessableEntity } from '~/core/error.response.ts';

export const getAllApps = async () => {
  return appRepository.getApps();
};

export const getApp = async (id: number) => {
  const app = await appRepository.getAppById(id);
  if (!app) {
    throw new NotFoundError('App not found');
  }
  return app;
};

export const getAppByName = async (name: string) => {
  return await appRepository.getAppByName(name);
}

export const createNewApp = async (data: any) => {
  const existingApp = await appRepository.getAppByName(data.name);
  if (existingApp) {
    throw new ConflictError('App already exists');
  }
  return await appRepository.createApp(data);
};

export const updateExistingApp = async (id: number, data: any) => {
  const app = await appRepository.getAppById(id);
  if (!app) {
    throw new NotFoundError('App not found');
  }

  if (!data || Object.keys(data).length === 0) {
    throw new UnprocessableEntity('At least one field is required');
  }

  return await appRepository.updateApp(id, data);
};

export const removeApp = async (id: number) => {
  const app = await appRepository.getAppById(id);
  if (!app) {
    throw new NotFoundError('App not found');
  }

  await appRepository.deleteApp(id);
};