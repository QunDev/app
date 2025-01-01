import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getApps = async () => {
  return prisma.app.findMany();
};

export const getAppById = async (id: number) => {
  return prisma.app.findUnique({ where: { id } });
};

export const getAppByName = async (name: string) => {
  return prisma.app.findFirst({ where: { name } });
}

export const createApp = async (data: any) => {
  return prisma.app.create({ data });
};

export const updateApp = async (id: number, data: any) => {
  return prisma.app.update({ where: { id }, data });
};

export const deleteApp = async (id: number) => {
  return prisma.app.delete({ where: { id } });
};