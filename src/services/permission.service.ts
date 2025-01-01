import * as permissionRepository from '~/repositories/permission.repository.ts';

export const getAllPermissions = async () => {
  return await permissionRepository.getPermissions();
};

export const getPermission = async (id: number) => {
  return await permissionRepository.getPermissionById(id);
};

export const createNewPermission = async (data: any) => {
  return await permissionRepository.createPermission(data);
};

export const updateExistingPermission = async (id: number, data: any) => {
  return await permissionRepository.updatePermission(id, data);
};

export const removePermission = async (id: number) => {
  return await permissionRepository.deletePermission(id);
};