import { z } from 'zod'

export const createAccountAppSchema = z.object({
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  address: z.string().optional(),
  zipcode: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  phone: z.string().optional(),
  sms: z.string().optional(),
  userId: z.number(),
  appId: z.number()
})

export const updateAccountAppSchema = z.object({
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  address: z.string().optional(),
  zipcode: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  phone: z.string().optional(),
  sms: z.string().optional()
})
