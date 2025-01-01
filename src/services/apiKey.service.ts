import { createApiKey, getApiKeyByKey, revokeApiKey } from "~/repositories/apiKey.repository.ts";
import { ConflictError, NotFoundError } from "~/core/error.response.ts";
import { nanoid } from 'nanoid';

export const generateApiKeyService = async (data: { description?: string; userId?: number; appId?: number }) => {
  const key = nanoid();
  const existingApiKey = await getApiKeyByKey(key);
  if (existingApiKey) {
    throw new ConflictError("API key already exists");
  }

  return createApiKey({ key, ...data });
};

export const revokeApiKeyService = async (key: string) => {
  const apiKey = await getApiKeyByKey(key);
  if (!apiKey) {
    throw new NotFoundError("API key not found");
  }

  return revokeApiKey(key);
};