import { z } from 'zod'

export const createUserRoleSchema = z.object({
  userId: z.number().int('Role ID must be an integer').positive('Role ID must be a positive integer'),
  roleIds: z.array(
    z.number().int('Permission ID must be an integer').positive('Permission ID must be a positive integer')
  )
})

export const updateUserRolesInputSchema = z.object({
  userId: z.number().int('Role ID must be an integer').positive('Role ID must be a positive integer'),
  roleIds: z.array(
    z.number().int('Permission ID must be an integer').positive('Permission ID must be a positive integer')
  )
})
