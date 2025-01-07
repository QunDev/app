import { z } from 'zod'

export const createRolePermissionSchema = z.object({
  roleId: z.number().int('Role ID must be an integer').positive('Role ID must be a positive integer'),
  permissionId: z
    .number()
    .int('Role Permission ID must be an integer')
    .positive('Role Permission ID must be a positive integer')
})

export const updateRolePermissionsInputSchema = z.object({
  roleId: z.number().int('Role ID must be an integer').positive('Role ID must be a positive integer'),
  permissionIds: z.array(
    z.number().int('Permission ID must be an integer').positive('Permission ID must be a positive integer')
  )
})
