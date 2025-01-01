import { prisma } from "~/utils/prismaClient.ts";
import { ApiKey } from "@prisma/client";

export const createApiKey = async (data: { key: string; description?: string; userId?: number; appId?: number }): Promise<ApiKey> => {
  return prisma.apiKey.create({
    data,
  });
};

export const getApiKeyByKey = async (key: string): Promise<ApiKey | null> => {
  return prisma.apiKey.findUnique({
    where: { key },
  });
};

export const revokeApiKey = async (key: string): Promise<ApiKey> => {
  return prisma.apiKey.update({
    where: { key },
    data: { status: "REVOKED" },
  });
};