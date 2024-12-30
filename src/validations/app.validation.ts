import { z } from 'zod';

export const createAppSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'App name is required' })
    .max(50, { message: 'App name must not exceed 50 characters' })
});