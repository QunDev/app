import { Role, User } from '@prisma/client'

export type userWithRoole = User & {
  userId?: number
  roles: {
    role: Role
  }[]
}
