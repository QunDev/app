import { z } from 'zod';

// Validation schema for API key creation
export const createApiKeySchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Service name is required' })
    .max(50, { message: 'Service name must not exceed 50 characters' }),

  userId: z
    .number()
    .int("User ID must be an integer")
    .positive('User ID must be a positive number'),

  rateLimit: z
    .number()
    .int("Rate limit must be an integer")
    .positive('Rate limit must be greater than 0'),

  expiresAt: z
    .string()
    .datetime({ message: 'Invalid date-time format' })
    .refine((date) => new Date(date) > new Date(), {
      message: 'Expiration date must be in the future',
    })
});