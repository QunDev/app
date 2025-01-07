import { Permission } from '@prisma/client'
import { PermissionRepository } from '~/repositories/permission.repository.ts'
import { prisma } from '~/utils/prismaClient.ts'
import { queueManager } from '~/instances/queueManager.instance.ts'

export class PermissionService {
  private readonly permissionRepository: PermissionRepository

  constructor(permissionRepository: PermissionRepository) {
    this.permissionRepository = permissionRepository
  }
  // Lấy danh sách Permission
  async getPermissions(): Promise<Permission[]> {
    return await this.permissionRepository.getPermissions()
  }

  // Lấy thông tin Permission bằng ID
  async getPermissionById(id: number): Promise<Permission | null> {
    return await this.permissionRepository.getPermissionById(id)
  }

  // Tạo mới Permission
  async createPermission(data: Pick<Permission, 'name'>): Promise<Permission> {
    const permission = await this.permissionRepository.getPermissionByName(data.name)
    if (permission) throw new Error('Permission already exists')
    // Thực hiện tạo mới
    return await this.permissionRepository.createPermission(data)
  }

  // Cập nhật thông tin Permission
  async updatePermission(data: Partial<Permission>): Promise<Pick<Permission, 'name' | 'description'>> {
    // Gửi job vào queue, hàm handler sẽ thực sự gọi transaction
    return queueManager.enqueue<Partial<Permission>, Pick<Permission, 'name' | 'description'>>(
      'UpdatePermissionOperation', // Tên operation
      data, // payload
      async (payload) => {
        // handler: gọi transaction để update DB
        return prisma.$transaction(async (tx) => {
          if (payload.name) {
            const existingPermission = await tx.permission.findFirst({
              where: {
                name: payload.name,
                NOT: { id: payload.id }
              }
            })

            if (existingPermission) {
              throw new Error('The new permission name is already in use by another permission.')
            }
          }

          // Trả về Permission đã update
          const updated = await tx.permission.update({
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

  // Xoá Permission
  async deletePermission(id: number): Promise<Permission> {
    return await this.permissionRepository.deletePermission(id)
  }

  // Reset Permission
  async resetPermission(id: number): Promise<Permission> {
    return await this.permissionRepository.resetPermission(id)
  }
}
