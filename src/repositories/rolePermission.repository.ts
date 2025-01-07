import { PrismaService } from '~/prisma/prisma.service.ts'
import { RolePermission } from '@prisma/client'

export class RolePermissionRepository {
  private readonly prisma: PrismaService

  constructor(prisma: PrismaService) {
    this.prisma = prisma
  }

  // Lấy danh sách RolePermission
  async getRolePermissions(): Promise<RolePermission[]> {
    return this.prisma.rolePermission.findMany({
      include: {
        permission: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        role: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      }
    })
  }

  // Lấy thông tin RolePermission bằng ID
  async getRolePermissionById(id: number): Promise<RolePermission | null> {
    return this.prisma.rolePermission.findUnique({
      where: { id },
      include: {
        permission: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        role: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      }
    })
  }

  // Lấy thông tin RolePermission bằng RoleID
  async getRolePermissionByRoleId(roleId: number): Promise<RolePermission[]> {
    return this.prisma.rolePermission.findMany({
      where: { roleId },
      include: {
        permission: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        role: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      }
    })
  }
}
