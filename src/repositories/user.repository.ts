import { PrismaService } from '~/prisma/prisma.service.ts'
import { User } from '@prisma/client'

export class UserRepository {
  private readonly prisma: PrismaService

  constructor(prisma: PrismaService) {
    this.prisma = prisma
  }

  // Lấy thông tin User bằng ID
  async getUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: true,
        phones: true,
        refreshTokens: true
      }
    })
  }

  // Cập nhật thông tin User
  async updateUser(id: number, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data
    })
  }

  // Xóa User
  async deleteUser(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id }
    })
  }

  // Lấy danh sách Users có phân trang
  async getUsers(skip: number, take: number): Promise<User[]> {
    return this.prisma.user.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' }
    })
  }

  // Tìm kiếm User bằng email
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          select: {
            roleId: true,
            role: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })
  }

  // Liên quan: Lấy thông tin chi tiết User với các mối quan hệ
  async getUserWithRelations(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: true,
        refreshTokens: true,
        apiKeys: true,
        apps: true
      }
    })
  }
}
