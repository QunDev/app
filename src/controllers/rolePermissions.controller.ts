import { Request, Response } from 'express'
import { PrismaService } from '~/prisma/prisma.service.ts'
import { CREATED, NO_CONTENT, OK } from '~/core/success.response.ts'
// import {createRolePermissionSchema} from "~/validations/rolePermission.validation.ts";
import { RolePermissionRepository } from '~/repositories/rolePermission.repository.ts'
import { RolePermissionService } from '~/services/rolePermission.service.ts'
import { BadRequest } from '~/core/error.response.ts'
import {
  createRolePermissionSchema,
  updateRolePermissionsInputSchema
} from '~/validations/rolePermission.validation.ts'

const prismaService = new PrismaService()
const rolePermissionRepository = new RolePermissionRepository(prismaService)
const rolePermissionService = new RolePermissionService(rolePermissionRepository)

export class RolePermissionController {
  async getRolePermissions(req: Request, res: Response) {
    const rolePermissions = await rolePermissionService.getRolePermissions()

    new OK({
      message: 'List rolePermissions successfully',
      metadata: rolePermissions
    }).send(res)
  }

  async getRolePermissionById(req: Request, res: Response) {
    const { id } = req.params
    if (isNaN(Number(id))) throw new BadRequest('Id must be a number')

    const rolePermission = await rolePermissionService.getRolePermissionById(Number(id))

    if (!rolePermission) {
      throw new BadRequest('RolePermission not found')
    }

    new OK({
      message: 'Get rolePermission successfully',
      metadata: rolePermission
    }).send(res)
  }

  async getRolePermissionByRoleId(req: Request, res: Response) {
    const { id } = req.params
    if (isNaN(Number(id))) throw new BadRequest('Role ID must be a number')

    const rolePermissions = await rolePermissionService.getRolePermissionByRoleId(Number(id))

    new OK({
      message: 'List rolePermissions by roleId successfully',
      metadata: rolePermissions
    }).send(res)
  }

  async createRolePermission(req: Request, res: Response) {
    const data = createRolePermissionSchema.parse(req.body)

    const rolePermission = await rolePermissionService.createRolePermission(data)

    new CREATED({
      message: 'Create rolePermission successfully',
      metadata: rolePermission
    }).send(res)
  }

  async updateRolePermission(req: Request, res: Response) {
    const { roleId, permissionIds } = updateRolePermissionsInputSchema.parse(req.body)

    const updatedPermissions = await rolePermissionService.updateRolePermissionsHardDelete({
      roleId,
      permissionIds
    })

    new OK({
      message: 'Update rolePermission successfully',
      metadata: updatedPermissions
    }).send(res)
  }
}
