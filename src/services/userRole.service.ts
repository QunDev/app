import { UserRole } from '@prisma/client'
import { UserRoleRepository } from '~/repositories/userRole.repository.ts'
import { prisma } from '~/utils/prismaClient.ts'
import { queueManager } from '~/instances/queueManager.instance.ts'
import { CreateMultipleUserRolesInput } from '~/types/userRole.type.ts'

export class UserRoleService {
  private readonly userRoleRepository: UserRoleRepository

  constructor(userRoleRepository: UserRoleRepository) {
    this.userRoleRepository = userRoleRepository
  }

  // Lấy danh sách Role
  async getUserRoles(): Promise<UserRole[]> {
    return await this.userRoleRepository.getUserRoles()
  }

  // Lấy thông tin UserRole bằng ID
  async getUserRoleById(id: number): Promise<UserRole | null> {
    return await this.userRoleRepository.getUserRoleById(id)
  }

  // Lấy thông tin UserRole bằng RoleID
  async getUserRoleByRoleId(roleId: number): Promise<UserRole[]> {
    return await this.userRoleRepository.getUserRoleByRoleId(roleId)
  }

  async createMultipleUserRoles(data: CreateMultipleUserRolesInput): Promise<UserRole[]> {
    return queueManager.enqueue<CreateMultipleUserRolesInput, UserRole[]>(
      'CreateMultipleUserRoles',
      data,
      async (payload) => {
        const { userId, roleIds } = payload

        return prisma.$transaction(async (tx) => {
          // 1) Kiểm tra User
          const user = await tx.user.findUnique({ where: { id: userId } })
          if (!user) {
            throw new Error('User not found')
          }

          // 2) Lấy danh sách Role từ DB theo roleIds
          const roles = await tx.role.findMany({
            where: { id: { in: roleIds } }
          })
          if (roles.length !== roleIds.length) {
            // Tuỳ yêu cầu, bạn có thể báo lỗi
            // nếu có roleId không tồn tại
            throw new Error('Some roles do not exist in database')
          }

          // 3) Lấy danh sách UserRole hiện có (để tránh trùng lặp)
          //    Tìm tất cả cặp (userId, roleId) đang có
          const existingUserRoles = await tx.userRole.findMany({
            where: {
              userId: userId,
              roleId: { in: roleIds }
            },
            select: { roleId: true }
          })
          const existingRoleIds = existingUserRoles.map((ur) => ur.roleId)

          // 4) Lọc ra những roleId chưa được gán
          const toCreate = roleIds.filter((rId) => !existingRoleIds.includes(rId))

          if (toCreate.length === 0) {
            // Tất cả roleId đã được gán rồi
            return []
          }

          // 5) Tạo hàng loạt UserRole mới
          //    (nếu Prisma < 2.30, dùng Promise.all với create())
          await tx.userRole.createMany({
            data: toCreate.map((rId) => ({
              userId: userId,
              roleId: rId
            }))
          })

          // 6) Lấy lại danh sách UserRole vừa tạo
          //    (Nếu muốn trả về tất cả roles của user
          //     có thể findMany({ where: { userId } }) thay vì filter)
          const newUserRoles = await tx.userRole.findMany({
            where: {
              userId: userId,
              roleId: { in: toCreate }
            },
            include: {
              role: true // tuỳ bạn, nếu muốn lấy chi tiết role
            }
          })

          return newUserRoles
        })
      }
    )
  }

  async updateUserRoles(data: CreateMultipleUserRolesInput): Promise<UserRole[]> {
    return queueManager.enqueue<CreateMultipleUserRolesInput, UserRole[]>('UpdateUserRoles', data, async (payload) => {
      const { userId, roleIds } = payload

      return prisma.$transaction(async (tx) => {
        // 1) Kiểm tra User
        const user = await tx.user.findUnique({ where: { id: userId } })
        if (!user) {
          throw new Error('User not found')
        }

        // 2) Lấy danh sách UserRole hiện tại
        const oldUserRoles = await tx.userRole.findMany({
          where: { userId },
          select: { roleId: true }
        })
        const oldRoleIds = oldUserRoles.map((ur) => ur.roleId)

        // 3) Tìm những roleId cần xóa (các roleId cũ không còn trong mảng mới)
        const toRemove = oldRoleIds.filter((rId) => !roleIds.includes(rId))

        // 4) Tìm những roleId cần thêm mới
        const toAdd = roleIds.filter((rId) => !oldRoleIds.includes(rId))

        // (Tuỳ ý) Kiểm tra xem roleIds có tồn tại trong DB không.
        // Nếu muốn chắc chắn, bạn có thể:
        const roles = await tx.role.findMany({
          where: { id: { in: roleIds } }
        })
        if (roles.length !== roleIds.length) {
          throw new Error('Some roleIds do not exist in DB.')
        }

        // 5) Xóa cứng các UserRole không còn dùng
        if (toRemove.length > 0) {
          await tx.userRole.deleteMany({
            where: {
              userId,
              roleId: { in: toRemove }
            }
          })
        }

        // 6) Tạo mới UserRole cho các roleId chưa có
        if (toAdd.length > 0) {
          // Nếu Prisma >= 2.30, dùng createMany
          await tx.userRole.createMany({
            data: toAdd.map((rId) => ({
              userId,
              roleId: rId
            }))
          })
        }

        // 7) Lấy lại danh sách UserRole mới nhất (cho userId)
        const updatedUserRoles = await tx.userRole.findMany({
          where: { userId },
          // Nếu muốn kèm thông tin Role, bạn có thể:
          include: { role: true }
        })

        return updatedUserRoles
      })
    })
  }
}
