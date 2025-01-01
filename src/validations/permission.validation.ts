import { z } from 'zod';

export const createPermissionSchema = z.object({
  action: z.string().min(1, 'Action is required'),
  resource: z.string().min(1, 'Resource is required'),
  description: z.string().optional(),
});

export const updatePermissionSchema = z.object({
  action: z.string().min(1, 'Action is required').optional(),
  resource: z.string().min(1, 'Resource is required').optional(),
  description: z.string().optional(),
});