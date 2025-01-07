import { PrismaService } from '~/prisma/prisma.service.ts'
import { UserRole } from '@prisma/client'

export class UserRoleRepository {
  private readonly prisma: PrismaService

  constructor(prisma: PrismaService) {
    this.prisma = prisma
  }

  // Lấy danh sách UserRole
  async getUserRoles(): Promise<UserRole[]> {
    return this.prisma.userRole.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
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

  // Lấy thông tin UserRole bằng ID
  async getUserRoleById(id: number): Promise<UserRole | null> {
    return this.prisma.userRole.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
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

  // Lấy thông tin UserRole bằng RoleID
  async getUserRoleByRoleId(roleId: number): Promise<UserRole[]> {
    return this.prisma.userRole.findMany({
      where: { roleId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
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
