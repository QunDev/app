import { z } from 'zod'

export const createEmailSchema = z.object({
  emails: z.array(z.string().min(1, 'Email number is required')),
  appId: z.number().int().positive('App ID must be a positive integer').optional(),
})

export const updateEmailSchema = z.object({
  email: z.string().min(1, 'Email number is required').optional(),
  appId: z.number().int().positive('App ID must be a positive integer').optional(),
})
