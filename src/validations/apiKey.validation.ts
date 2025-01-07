import { z } from 'zod'

export const createApiKeySchema = z.object({
  description: z.string().optional(),
  userId: z.number().optional(),
  appId: z.number().optional()
})
