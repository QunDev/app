import {Request, Response} from 'express'
import {createApiKeySchema} from '~/validations/apiKey.validation.ts'
import {CREATED, OK} from '~/core/success.response.ts'
import {PrismaService} from "~/prisma/prisma.service.ts";
import {ApiKeyService} from "~/services/apiKey.service.ts";
import {ApiKeyRepository} from "~/repositories/apiKey.repository.ts";
import {BadRequest} from "~/core/error.response.ts";

const primaService = new PrismaService()
const apiKeyRepository = new ApiKeyRepository(primaService)
const apiKeyService = new ApiKeyService(apiKeyRepository)

export class ApiKeyController {
  async generateApiKey(req: Request, res: Response) {
    const validatedData = createApiKeySchema.parse(req.body)
    if (!req.user.userId) {
      throw new BadRequest('User not found')
    }
    const apiKey = await apiKeyService.createApiKey({...validatedData, userId: req.user.userId})

    new CREATED({message: 'API key generated successfully', metadata: apiKey}).send(res)
  }

  async revokeApiKey(req: Request, res: Response) {
    const {key} = req.params

    if (!key) throw new BadRequest('API key is required')

    const apiKey = await apiKeyService.revokeApiKey(key)

    new OK({message: 'API key revoked successfully', metadata: apiKey}).send(res)
  }
}