// `src/controllers/role.controller.ts`
import {Request, Response, NextFunction} from 'express';
import * as roleService from '~/services/role.service.ts';
import {CREATED, OK} from '~/core/success.response.ts';
import {asyncHandler} from "~/helper/errorHandle.ts";

export const getRoles = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roles = await roleService.getAllRoles();
    new OK({message: 'Roles retrieved successfully', metadata: roles}).send(res);
  } catch (error) {
    next(error);
  }
});

export const getRole = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = await roleService.getRole(Number(req.params.id));
    new OK({message: 'Role retrieved successfully', metadata: role}).send(res);
  } catch (error) {
    next(error);
  }
});

export const createRole = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newRole = await roleService.createNewRole(req.body);
    new CREATED({message: 'Role created successfully', metadata: newRole}).send(res);
  } catch (error) {
    next(error);
  }
});

export const updateRole = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedRole = await roleService.updateExistingRole(Number(req.params.id), req.body);
    new OK({message: 'Role updated successfully', metadata: updatedRole}).send(res);
  } catch (error) {
    next(error);
  }
});

export const deleteRole = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await roleService.removeRole(Number(req.params.id));
    new OK({message: 'Role deleted successfully', metadata: undefined}).send(res);
  } catch (error) {
    next(error);
  }
});