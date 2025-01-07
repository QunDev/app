import { Request, Response } from 'express'
import { PrismaService } from '~/prisma/prisma.service.ts'
import { CREATED, OK } from '~/core/success.response.ts'
import { getInfoData } from '~/utils'
import { createPermissionSchema, updatePermissionSchema } from '~/validations/permission.validation.ts'
import { PermissionRepository } from '~/repositories/permission.repository.ts'
import { PermissionService } from '~/services/permission.service.ts'
import { BadRequest } from '~/core/error.response.ts'

const prismaService = new PrismaService()
const permissionRepository = new PermissionRepository(prismaService)
const permissionService = new PermissionService(permissionRepository)

export class PermissionController {
  async getPermissions(req: Request, res: Response) {
    const permissions = await permissionService.getPermissions()

    new OK({
      message: 'List permissions successfully',
      metadata: permissions
    }).send(res)
  }

  async getPermissionById(req: Request, res: Response) {
    const id = parseInt(req.params.id)
    if (isNaN(id)) throw new BadRequest('Invalid ID')
    const permission = await permissionService.getPermissionById(id)

    new OK({
      message: 'Get permission successfully',
      metadata: permission
    }).send(res)
  }

  async createPermission(req: Request, res: Response) {
    const validatedData = createPermissionSchema.parse(req.body)

    const permission = await permissionService.createPermission(validatedData)

    new CREATED({
      message: 'Created successfully',
      metadata: getInfoData({
        fileds: ['name', 'description', 'createdAt'],
        object: permission
      })
    }).send(res)
  }

  async updatePermission(req: Request, res: Response) {
    // Validate
    const validatedData = updatePermissionSchema.parse(req.body)

    // Gọi service => service tự lo queue
    const updatedPermission = await permissionService.updatePermission(validatedData)

    // Trả về kết quả
    new OK({
      message: 'Updated successfully',
      metadata: updatedPermission
    }).send(res)
  }

  async deletePermission(req: Request, res: Response) {
    const id = parseInt(req.params.id)
    if (isNaN(id)) throw new BadRequest('Invalid ID')
    const permission = await permissionService.deletePermission(id)

    new OK({
      message: 'Deleted successfully',
      metadata: permission
    }).send(res)
  }

  async resetPermission(req: Request, res: Response) {
    const id = parseInt(req.params.id)
    if (isNaN(id)) throw new BadRequest('Invalid ID')
    const permission = await permissionService.resetPermission(id)

    new OK({
      message: 'Reset successfully',
      metadata: permission
    }).send(res)
  }
}
