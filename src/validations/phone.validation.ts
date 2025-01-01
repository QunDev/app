import { z } from 'zod';

export const createPhoneSchema = z.object({
  numbers: z.array(z.string().min(1, 'Phone number is required')),
  appId: z.number().int().positive('App ID must be a positive integer').optional(),
  countryPhoneId: z.number().int().positive('Country Phone ID must be a positive integer'),
  userId: z.number().int().positive('User ID must be a positive integer'),
});

export const updatePhoneSchema = z.object({
  number: z.string().min(1, 'Phone number is required').optional(),
  appId: z.number().int().positive('App ID must be a positive integer').optional(),
  countryPhoneId: z.number().int().positive('Country Phone ID must be a positive integer').optional(),
  userId: z.number().int().positive('User ID must be a positive integer').optional(),
});