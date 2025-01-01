// `src/repositories/role.repository.ts`
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getRoles = async () => {
  return prisma.role.findMany();
};

export const getRoleById = async (id: number) => {
  return prisma.role.findUnique({ where: { id } });
};

export const createRole = async (data: any) => {
  return prisma.role.create({ data });
};

export const updateRole = async (id: number, data: any) => {
  return prisma.role.update({ where: { id }, data });
};

export const deleteRole = async (id: number) => {
  return prisma.role.delete({ where: { id } });
};

export const getRoleByName = async (name: string) => {
  return prisma.role.findFirst({ where: { name } });
};