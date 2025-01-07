import { z } from 'zod'

export const createUserRoleSchema = z.object({
  roleIds: z.array(
    z.number().int('Permission ID must be an integer').positive('Permission ID must be a positive integer')
  )
})

export const updateUserRolesInputSchema = z.object({
  roleIds: z.array(
    z.number().int('Permission ID must be an integer').positive('Permission ID must be a positive integer')
  )
})
