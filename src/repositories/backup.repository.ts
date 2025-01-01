import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const getBackups = async () => {
  return prisma.backup.findMany();
};

export const getBackupById = async (id: number) => {
  return prisma.backup.findUnique({where: {id}});
};

export const createBackup = async ({filename, filepath, filesize, appId, description, userId}: {
  filename: string; filepath: string; filesize: number; appId: number; description?: string; userId: number;
}) => {
  return prisma.backup.create({
    data: {
      filename,
      filepath,
      filesize,
      appId,
      description,
      userId,
    }
  });
};

export const updateBackup = async (id: number, data: any) => {
  return prisma.backup.update({where: {id}, data});
};

export const deleteBackup = async (id: number) => {
  return prisma.backup.delete({where: {id}});
};

export const getBackupByFilename = async (filename: string) => {
  return prisma.backup.findFirst({ where: { filename } });
};