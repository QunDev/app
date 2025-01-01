import { z } from 'zod';

export const createAppSchema = z.object({
  name: z.string().min(1, 'App name is required'),
  userId: z.number().int().positive('User ID must be a positive integer'),
});

export const updateAppSchema = z.object({
  name: z.string().min(1, 'App name is required').optional(),
  userId: z.number().int().positive('User ID must be a positive integer').optional(),
});