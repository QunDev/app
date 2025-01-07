import { ConflictError, NotFoundError } from '~/core/error.response.ts'
import { nanoid } from 'nanoid'
import {ApiKeyRepository} from "~/repositories/apiKey.repository.ts";
import {ApiKey} from "@prisma/client";

export class ApiKeyService {
  private readonly apiKeyRepository: ApiKeyRepository

  constructor(apiKeyRepository: ApiKeyRepository) {
    this.apiKeyRepository = apiKeyRepository
  }

  async createApiKey(data: Partial<ApiKey>) {
    const key = nanoid()

    const existingApiKey = await this.apiKeyRepository.getApiKeyByKey(key)
    if (existingApiKey) {
      throw new ConflictError('API key already exists')
    }

    return this.apiKeyRepository.createApiKey({ ...data, key })
  }

  async revokeApiKey(key: string) {
    const apiKey = await this.apiKeyRepository.getApiKeyByKey(key)
    if (!apiKey) {
      throw new NotFoundError('API key not found')
    }

    return this.apiKeyRepository.revokeApiKey(key)
  }
}
