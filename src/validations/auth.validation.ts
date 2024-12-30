import { z } from 'zod';

// Validation schema for API key creation\
export const signUpUserSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Service name is required' })
    .max(50, { message: 'Service name must not exceed 50 characters' }),

  email: z
    .string()
    .email({ message: 'Invalid email format' }),

  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
});