import { z } from 'zod'

export const createAppSchema = z.object({
  name: z.string().min(1, 'App name is required'),
  updated: z.string().optional(),
})

export const updateAppSchema = z.object({
  name: z.string().min(1, 'App name is required').optional(),
  updated: z.string().optional(),
})
