import { Request, Response } from 'express'
import { PrismaService } from '~/prisma/prisma.service.ts'
import { CREATED, NO_CONTENT, OK } from '~/core/success.response.ts'
import { BadRequest } from '~/core/error.response.ts'
import { UserRoleRepository } from '~/repositories/userRole.repository.ts'
import { UserRoleService } from '~/services/userRole.service.ts'
import { createUserRoleSchema, updateUserRolesInputSchema } from '~/validations/userRole.validation.ts'
import { CreateMultipleUserRolesInput } from '~/types/userRole.type.ts'

const prismaService = new PrismaService()
const userRoleRepository = new UserRoleRepository(prismaService)
const userRoleService = new UserRoleService(userRoleRepository)

export class UserRoleController {
  async getUserRoles(req: Request, res: Response) {
    const userRoles = await userRoleService.getUserRoles()

    new OK({
      message: 'List userRoles successfully',
      metadata: userRoles
    }).send(res)
  }

  async getUserRoleById(req: Request, res: Response) {
    const { id } = req.params
    if (isNaN(Number(id))) throw new BadRequest('Id must be a number')

    const userRole = await userRoleService.getUserRoleById(Number(id))

    if (!userRole) {
      throw new BadRequest('UserRole not found')
    }

    new OK({
      message: 'Get userRole successfully',
      metadata: userRole
    }).send(res)
  }

  async getUserRoleByRoleId(req: Request, res: Response) {
    const { id } = req.params
    if (isNaN(Number(id))) throw new BadRequest('Role ID must be a number')

    const userRoles = await userRoleService.getUserRoleByRoleId(Number(id))

    new OK({
      message: 'List userRoles by roleId successfully',
      metadata: userRoles
    }).send(res)
  }

  async createUserRole(req: Request, res: Response) {
    const data = createUserRoleSchema.parse(req.body)

    const userRole = await userRoleService.createMultipleUserRoles({
      ...data,
      userId: req.user.id
    })

    new CREATED({
      message: 'Create userRole successfully',
      metadata: userRole
    }).send(res)
  }

  async updateUserRole(req: Request, res: Response) {
    const data = updateUserRolesInputSchema.parse(req.body)

    const updatedPermissions = await userRoleService.updateUserRoles({
      ...data,
      userId: req.user.id
    })

    new OK({
      message: 'Update userRole successfully',
      metadata: updatedPermissions
    }).send(res)
  }
}
