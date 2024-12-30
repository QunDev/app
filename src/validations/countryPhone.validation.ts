import {z} from 'zod';

export const createCountryPhoneSchema = z.object({
  country: z.string().min(1).max(20),
  numberCode: z.string().min(1).max(20),
});