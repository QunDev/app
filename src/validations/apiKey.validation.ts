import { z } from 'zod'

export const createApiKeySchema = z.object({
  description: z.string().optional(),
  appId: z.number().optional()
})
