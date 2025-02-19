import { z } from 'zod'

export const createCountryPhoneSchema = z.object({
  country: z.string().min(1, 'Country is required'),
})

export const updateCountryPhoneSchema = z.object({
  country: z.string().min(1, 'Country is required').optional(),
})
