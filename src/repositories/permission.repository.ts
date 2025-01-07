import { PrismaService } from '~/prisma/prisma.service.ts'
import { Permission } from '@prisma/client'

export class PermissionRepository {
  private readonly prisma: PrismaService

  constructor(prisma: PrismaService) {
    this.prisma = prisma
  }

  // Lấy danh sách Permission
  async getPermissions(): Promise<Permission[]> {
    return this.prisma.permission.findMany({
      orderBy: { createdAt: 'desc' }
    })
  }

  // Lấy thông tin Permission bằng ID
  async getPermissionById(id: number): Promise<Permission | null> {
    return this.prisma.permission.findUnique({
      where: { id }
    })
  }

  // Lấy thông tin Permission bằng Name
  async getPermissionByName(name: string): Promise<Permission | null> {
    return this.prisma.permission.findUnique({
      where: { name }
    })
  }

  // Tạo mới Permission
  async createPermission(data: Pick<Permission, 'name'>): Promise<Permission> {
    return this.prisma.permission.create({ data })
  }

  // Xoá Permission
  async deletePermission(id: number): Promise<Permission> {
    return this.prisma.permission.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isDeleted: true
      }
    })
  }

  // Reset Permission
  async resetPermission(id: number): Promise<Permission> {
    return this.prisma.permission.update({
      where: { id },
      data: {
        deletedAt: null,
        isDeleted: false
      }
    })
  }
}
