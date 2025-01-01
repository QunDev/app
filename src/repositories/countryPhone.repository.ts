import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCountryPhones = async () => {
  return prisma.countryPhone.findMany();
};

export const getCountryPhoneById = async (id: number) => {
  return prisma.countryPhone.findUnique({ where: { id } });
};

export const getCountryPhoneByNumberCode = async (numberCode: string) => {
  return prisma.countryPhone.findFirst({ where: { numberCode } });
};

export const createCountryPhone = async (data: any) => {
  return prisma.countryPhone.create({ data });
};

export const updateCountryPhone = async (id: number, data: any) => {
  return prisma.countryPhone.update({ where: { id }, data });
};

export const deleteCountryPhone = async (id: number) => {
  return prisma.countryPhone.delete({ where: { id } });
};