import { PrismaService } from '~/prisma/prisma.service.ts'
import { Role } from '@prisma/client'

export class RoleRepository {
  private readonly prisma: PrismaService

  constructor(prisma: PrismaService) {
    this.prisma = prisma
  }

  // Lấy danh sách Role
  async getRoles(): Promise<Role[]> {
    return this.prisma.role.findMany({
      orderBy: { createdAt: 'desc' }
    })
  }

  // Lấy thông tin Role bằng ID
  async getRoleById(id: number): Promise<Role | null> {
    return this.prisma.role.findUnique({
      where: { id }
    })
  }

  // Tạo mới Role
  async createRole(data: Pick<Role, 'name'>): Promise<Role> {
    return this.prisma.role.create({ data })
  }

  // Lấy thông tin Role bằng Name
  async getRoleByName(name: string): Promise<Role | null> {
    return this.prisma.role.findUnique({
      where: { name }
    })
  }

  // Xoá Role
  async deleteRole(id: number): Promise<Role> {
    return this.prisma.role.update({
      where: {
        id,
        isDeleted: false
      },
      data: {
        deletedAt: new Date(),
        isDeleted: true
      }
    })
  }

  // Reset Role
  async resetRole(id: number): Promise<Role> {
    return this.prisma.role.update({
      where: {
        id,
        isDeleted: true
      },
      data: {
        deletedAt: null,
        isDeleted: false
      }
    })
  }
}
