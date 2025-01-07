import { z } from 'zod'

export const createPermissionSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces'),
  description: z
    .string()
    .min(2, 'Description must be at least 2 characters long')
    .max(255, 'Description must not exceed 255 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces')
    .optional()
})

export const updatePermissionSchema = z.object({
  id: z.number().int().positive('Id must be a positive integer').min(1, 'Id must be a positive integer'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces')
    .optional(),
  description: z
    .string()
    .min(2, 'Description must be at least 2 characters long')
    .max(255, 'Description must not exceed 255 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces')
    .optional()
})
