import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPhones = async () => {
  return prisma.phone.findMany();
};

export const getPhoneById = async (id: number) => {
  return prisma.phone.findUnique({ where: { id } });
};

export const getPhoneByNumber = async (number: string) => {
  return prisma.phone.findUnique({ where: { number } });
};

export const createPhones = async (data: any[]) => {
  return prisma.phone.createMany({ data });
};

export const updatePhone = async (id: number, data: any) => {
  return prisma.phone.update({ where: { id }, data });
};

export const deletePhone = async (id: number) => {
  return prisma.phone.delete({ where: { id } });
};

export const deleteAllPhones = async () => {
  return prisma.phone.deleteMany();
}

export const getRandomPhoneByAppId = async (appId: number) => {
  const phone = await prisma.phone.findFirst({
    where: { appId },
    orderBy: { updatedAt: 'asc' },
  });

  if (phone) {
    const update = await prisma.phone.update({
      where: { id: phone.id },
      data: { updatedAt: new Date() },
    });
  }

  return phone;
};

export const updatePhones = async (data: { id: number, updateData: any }[]) => {
  const updatePromises = data.map(phone =>
    prisma.phone.update({
      where: { id: phone.id },
      data: phone.updateData,
    })
  );
  return Promise.all(updatePromises);
};

export const updateAppIdAllPhones = async (appId: number, phoneIds: number[]) => {
  const batchSize = 1000; // Kích thước mỗi lô
  const totalBatches = Math.ceil(phoneIds.length / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const batch = phoneIds.slice(i * batchSize, (i + 1) * batchSize);
    await prisma.phone.updateMany({
      where: {
        id: {
          in: batch,
        },
      },
      data: {
        appId,
      },
    });
  }
};