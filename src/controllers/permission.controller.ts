import {Request, Response, NextFunction} from 'express';
import * as permissionService from '~/services/permission.service.ts';
import {CREATED, OK} from "~/core/success.response.ts";
import {undefined} from "zod";
import {asyncHandler} from "~/helper/errorHandle.ts";

export const getPermissions = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const permissions = await permissionService.getAllPermissions();
    new OK({message: 'Permissions retrieved successfully', metadata: permissions}).send(res);
  } catch (error) {
    next(error);
  }
});

export const getPermission = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const permission = await permissionService.getPermission(Number(req.params.id));
    new OK({message: 'Permission retrieved successfully', metadata: permission}).send(res);
  } catch (error) {
    next(error);
  }
});

export const createPermission = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newPermission = await permissionService.createNewPermission(req.body);
    new CREATED({message: 'Permission created successfully', metadata: newPermission}).send(res);
  } catch (error) {
    next(error);
  }
});

export const updatePermission = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedPermission = await permissionService.updateExistingPermission(Number(req.params.id), req.body);
    new OK({message: 'Permission updated successfully', metadata: updatedPermission}).send(res);
  } catch (error) {
    next(error);
  }
});

export const deletePermission = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await permissionService.removePermission(Number(req.params.id));
    new OK({metadata: undefined, message: 'Permission deleted successfully'}).send(res);
  } catch (error) {
    next(error);
  }
});