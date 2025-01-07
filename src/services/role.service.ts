import { Role } from '@prisma/client'
import { RoleRepository } from '~/repositories/role.repository.ts'
import { prisma } from '~/utils/prismaClient.ts'
import { queueManager } from '~/instances/queueManager.instance.ts'

export class RoleService {
  private readonly roleRepository: RoleRepository

  constructor(roleRepository: RoleRepository) {
    this.roleRepository = roleRepository
  }
  // Lấy danh sách Role
  async getRoles(): Promise<Role[]> {
    return await this.roleRepository.getRoles()
  }

  // Lấy thông tin Role bằng ID
  async getRoleById(id: number): Promise<Role | null> {
    return await this.roleRepository.getRoleById(id)
  }

  // Tạo mới User
  async createRole(data: Pick<Role, 'name'>): Promise<Role> {
    const role = await this.roleRepository.getRoleByName(data.name)
    if (role) throw new Error('Role already exists')
    // Thực hiện tạo mới
    return await this.roleRepository.createRole(data)
  }

  // Cập nhật thông tin Role
  async updateRole(data: Partial<Role>): Promise<Pick<Role, 'name' | 'description'>> {
    // Gửi job vào queue, hàm handler sẽ thực sự gọi transaction
    return queueManager.enqueue<Partial<Role>, Pick<Role, 'name' | 'description'>>(
      'UpdateRoleOperation', // Tên operation
      data, // payload
      async (payload) => {
        // handler: gọi transaction để update DB
        return prisma.$transaction(async (tx) => {
          if (payload.name) {
            const existingRole = await tx.role.findFirst({
              where: {
                name: payload.name,
                NOT: { id: payload.id }
              }
            })

            if (existingRole) {
              throw new Error('The new role name is already in use by another role.')
            }
          }

          // Trả về Role đã update
          const updated = await tx.role.update({
            where: { id: payload.id },
            data: payload,
            select: {
              name: true,
              description: true
            }
          })
          return updated
        })
      }
    )
  }

  // Xoá Role
  async deleteRole(id: number): Promise<Role> {
    return await this.roleRepository.deleteRole(id)
  }

  // Reset Role
  async resetRole(id: number): Promise<Role> {
    return await this.roleRepository.resetRole(id)
  }
}
