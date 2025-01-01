// `src/services/role.service.ts`
import * as roleRepository from '~/repositories/role.repository.ts';
import {NotFoundError, UnprocessableEntity} from "~/core/error.response.ts";

export const getAllRoles = async () => {
  return await roleRepository.getRoles();
};

export const getRole = async (id: number) => {
  return await roleRepository.getRoleById(id);
};

export const createNewRole = async (data: any) => {
  const role = await roleRepository.getRoleByName(data.name);

  if (role) {
    throw new UnprocessableEntity('Role with the same name already exists');
  }

  return await roleRepository.createRole(data);
};

export const updateExistingRole = async (id: number, data: any) => {
  const role = await roleRepository.getRoleById(id);
  if (!role) {
    throw new NotFoundError('Role not found');
  }
  if (!data || Object.keys(data).length === 0) {
    throw new UnprocessableEntity('No data provided for update');
  }
  return await roleRepository.updateRole(id, data);
};

export const removeRole = async (id: number) => {
  const role = await roleRepository.getRoleById(id);
  if (!role) {
    throw new NotFoundError('Role not found');
  }
  return await roleRepository.deleteRole(id);
};