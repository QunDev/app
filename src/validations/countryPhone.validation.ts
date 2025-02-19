import { z } from 'zod'

export const createCountryPhoneSchema = z.object({
  country: z.string().min(1, 'Country is required'),
  numberCode: z.string().min(1, 'Number code is required')
})

export const updateCountryPhoneSchema = z.object({
  country: z.string().min(1, 'Country is required').optional(),
  numberCode: z.string().min(1, 'Number code is required').optional()
})
