import { prisma } from "~/utils/prismaClient.ts";
import { User } from "@prisma/client";

export const createUser = async (data: { name: string; email: string; password: string }): Promise<User> => {
  return prisma.user.create({
    data,
  });
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email },
  });
};