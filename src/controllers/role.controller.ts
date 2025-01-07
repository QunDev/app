import { Request, Response } from 'express'
import { PrismaService } from '~/prisma/prisma.service.ts'
import { CREATED, NO_CONTENT, OK } from '~/core/success.response.ts'
import { getInfoData } from '~/utils'
import { createRoleSchema, updateRoleSchema } from '~/validations/role.validation.ts'
import { RoleRepository } from '~/repositories/role.repository.ts'
import { RoleService } from '~/services/role.service.ts'
import { BadRequest } from '~/core/error.response.ts'

const prismaService = new PrismaService()
const roleRepository = new RoleRepository(prismaService)
const roleService = new RoleService(roleRepository)

export class RoleController {
  async getRoles(req: Request, res: Response) {
    const roles = await roleService.getRoles()

    new OK({
      message: 'List roles successfully',
      metadata: roles
    }).send(res)
  }

  async getRoleById(req: Request, res: Response) {
    const id = parseInt(req.params.id)
    if (isNaN(id)) throw new BadRequest('Invalid ID')
    const role = await roleService.getRoleById(id)

    new OK({
      message: 'Get role successfully',
      metadata: role
    }).send(res)
  }

  async createRole(req: Request, res: Response) {
    const validatedData = createRoleSchema.parse(req.body)

    const role = await roleService.createRole(validatedData)

    new CREATED({
      message: 'Created successfully',
      metadata: getInfoData({
        fileds: ['name', 'description', 'createdAt'],
        object: role
      })
    }).send(res)
  }

  async updateRole(req: Request, res: Response) {
    // Validate
    const validatedData = updateRoleSchema.parse(req.body)

    // Gọi service => service tự lo queue
    const updatedRole = await roleService.updateRole(validatedData)

    // Trả về kết quả
    new OK({
      message: 'Updated successfully',
      metadata: updatedRole
    }).send(res)
  }

  async deleteRole(req: Request, res: Response) {
    const id = parseInt(req.params.id)
    if (isNaN(id)) throw new BadRequest('Invalid ID')
    const role = await roleService.deleteRole(id)

    new OK({
      message: 'Deleted role successfully',
      metadata: undefined
    }).send(res)
  }

  async resetRole(req: Request, res: Response) {
    const id = parseInt(req.params.id)
    if (isNaN(id)) throw new BadRequest('Invalid ID')
    const role = await roleService.resetRole(id)

    new OK({
      message: 'Reset role successfully',
      metadata: undefined
    }).send(res)
  }
}
