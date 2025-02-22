import { z } from 'zod'

export const createBackupSchema = z.object({
  appId: z.string().nonempty('App ID is required'),
  description: z.string().optional(),
})

export const updateBackupSchema = z.object({
  appId: z.number().int().positive('App ID must be a positive integer').optional(),
  description: z.string().optional()
})
