import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPermissions = async () => {
  return await prisma.permission.findMany();
};

export const getPermissionById = async (id: number) => {
  return await prisma.permission.findUnique({ where: { id } });
};

export const createPermission = async (data: any) => {
  return await prisma.permission.create({ data });
};

export const updatePermission = async (id: number, data: any) => {
  return await prisma.permission.update({ where: { id }, data });
};

export const deletePermission = async (id: number) => {
  return await prisma.permission.delete({ where: { id } });
};