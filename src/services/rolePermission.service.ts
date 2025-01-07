import { RolePermission } from '@prisma/client'
import { RolePermissionRepository } from '~/repositories/rolePermission.repository.ts'
import { prisma } from '~/utils/prismaClient.ts'
import { queueManager } from '~/instances/queueManager.instance.ts'
import { UpdateRolePermissionsInput } from '~/types/rolePermission.type.ts'

export class RolePermissionService {
  private readonly rolePermissionRepository: RolePermissionRepository

  constructor(rolePermissionRepository: RolePermissionRepository) {
    this.rolePermissionRepository = rolePermissionRepository
  }

  // Lấy danh sách Role
  async getRolePermissions(): Promise<RolePermission[]> {
    return await this.rolePermissionRepository.getRolePermissions()
  }

  // Lấy thông tin RolePermission bằng ID
  async getRolePermissionById(id: number): Promise<RolePermission | null> {
    return await this.rolePermissionRepository.getRolePermissionById(id)
  }

  // Lấy thông tin RolePermission bằng RoleID
  async getRolePermissionByRoleId(roleId: number): Promise<RolePermission[]> {
    return await this.rolePermissionRepository.getRolePermissionByRoleId(roleId)
  }

  async createRolePermission(data: Pick<RolePermission, 'roleId' | 'permissionId'>): Promise<RolePermission> {
    // Gửi job vào queue, hàm handler sẽ thực sự gọi transaction
    return queueManager.enqueue<Pick<RolePermission, 'roleId' | 'permissionId'>, RolePermission>(
      'CreateRolePermission', // Tên operation
      data, // payload
      async (payload) => {
        // handler: gọi transaction để update DB
        return prisma.$transaction(async (tx) => {
          const [role, permission, existingRolePermission] = await Promise.all([
            tx.role.findUnique({ where: { id: payload.roleId } }),
            tx.permission.findUnique({ where: { id: payload.permissionId } }),
            tx.rolePermission.findFirst({
              where: {
                roleId: payload.roleId,
                permissionId: payload.permissionId
              }
            })
          ])

          if (!role) {
            throw new Error('Role not found')
          }
          if (!permission) {
            throw new Error('Permission not found')
          }
          if (existingRolePermission) {
            throw new Error('RolePermission already exists')
          }

          // Trả về Role đã update
          const rolePermission = await tx.rolePermission.create({
            data: payload
          })
          return rolePermission
        })
      }
    )
  }

  // async updateRolePermissions(
  //   data: UpdateRolePermissionsInput
  // ): Promise<RolePermission[]> {
  //   // Sử dụng queueManager để giới hạn concurrency, vẫn await để lấy kết quả
  //   return queueManager.enqueue<UpdateRolePermissionsInput, RolePermission[]>(
  //     'UpdateRolePermissions',
  //     data,
  //     async (payload) => {
  //       const {roleId, permissionIds} = payload;
  //
  //       // Gói trong transaction
  //       return prisma.$transaction(async (tx) => {
  //         // 1) Kiểm tra Role có tồn tại không
  //         const role = await tx.role.findUnique({where: {id: roleId}});
  //         if (!role) {
  //           throw new Error('Role not found');
  //         }
  //
  //         // 2) Lấy danh sách RolePermission hiện tại (còn hiệu lực) của Role
  //         const oldRolePermissions = await tx.rolePermission.findMany({
  //           where: {
  //             roleId,
  //             isDeleted: false,
  //           },
  //           select: {
  //             id: true,
  //             permissionId: true,
  //           },
  //         });
  //         const oldPermissionIds = oldRolePermissions.map((rp) => rp.permissionId);
  //
  //         // 3) Xác định những permission cần xóa (hoặc đánh dấu isDeleted)
  //         const toRemove = oldPermissionIds.filter(
  //           (pId) => !permissionIds.includes(pId)
  //         );
  //
  //         // 4) Xác định những permission cần thêm mới (chưa có trong old)
  //         const toAdd = permissionIds.filter((pId) => !oldPermissionIds.includes(pId));
  //
  //         // 5) Đánh dấu isDeleted các permission cũ không còn sử dụng
  //         if (toRemove.length > 0) {
  //           await tx.rolePermission.updateMany({
  //             where: {
  //               roleId,
  //               permissionId: {in: toRemove},
  //               isDeleted: false, // chỉ đánh dấu những cái đang active
  //             },
  //             data: {
  //               isDeleted: true,
  //               deletedAt: new Date(),
  //             },
  //           });
  //         }
  //
  //         // 6) Thêm mới (hoặc khôi phục) các permission cần gán
  //         //    Dùng upsert để nếu từng bị xóa, ta khôi phục
  //         await Promise.all(
  //           toAdd.map((pId) => {
  //             return tx.rolePermission.upsert({
  //               where: {
  //                 // Trong schema, ta có @@unique([roleId, permissionId])
  //                 roleId_permissionId: {
  //                   roleId,
  //                   permissionId: pId,
  //                 },
  //               },
  //               update: {
  //                 // Nếu row tồn tại (bị xóa trước đó),
  //                 // ta khôi phục bằng set isDeleted=false, xóa deletedAt
  //                 isDeleted: false,
  //                 deletedAt: null,
  //               },
  //               create: {
  //                 roleId,
  //                 permissionId: pId,
  //               },
  //             });
  //           })
  //         );
  //
  //         // 7) Lấy lại danh sách RolePermission còn hiệu lực
  //         const updatedRolePermissions = await tx.rolePermission.findMany({
  //           where: {
  //             roleId,
  //             isDeleted: false,
  //           },
  //           include: {
  //             permission: {
  //               select: {
  //                 id: true,
  //                 name: true,
  //                 description: true,
  //               },
  //             },
  //           },
  //         });
  //
  //         return updatedRolePermissions;
  //       });
  //     }
  //   );
  // }

  async updateRolePermissionsHardDelete(data: UpdateRolePermissionsInput): Promise<RolePermission[]> {
    // Đưa vào queue, đồng thời trả về Promise
    return queueManager.enqueue<UpdateRolePermissionsInput, RolePermission[]>(
      'UpdateRolePermissionsHardDelete',
      data,
      async (payload) => {
        const { roleId, permissionIds } = payload

        return prisma.$transaction(async (tx) => {
          // 1) Kiểm tra Role có tồn tại không
          const role = await tx.role.findUnique({ where: { id: roleId } })
          if (!role) {
            throw new Error('Role not found')
          }

          // 2) Lấy danh sách RolePermission hiện tại của Role
          const oldRolePermissions = await tx.rolePermission.findMany({
            where: { roleId },
            select: {
              id: true,
              permissionId: true
            }
          })
          const oldPermissionIds = oldRolePermissions.map((rp) => rp.permissionId)

          // 3) Tìm những permission cần xóa hẳn
          //    (Những permission cũ không còn nằm trong danh sách mới)
          const toRemove = oldPermissionIds.filter((pId) => !permissionIds.includes(pId))

          // 4) Tìm những permission cần thêm
          //    (Những permission mới chưa có trong list cũ)
          const toAdd = permissionIds.filter((pId) => !oldPermissionIds.includes(pId))

          // 5) Xoá cứng RolePermission không còn dùng
          if (toRemove.length > 0) {
            await tx.rolePermission.deleteMany({
              where: {
                roleId,
                permissionId: { in: toRemove }
              }
            })
          }

          // 6) Tạo mới RolePermission cho các permissionId cần thêm
          if (toAdd.length > 0) {
            // Tùy nhu cầu, bạn có thể dùng createMany (nếu Prisma phiên bản >= 2.30)
            //  hoặc lặp map create() từng cái. Dưới đây là ví dụ createMany:
            await tx.rolePermission.createMany({
              data: toAdd.map((pId) => ({
                roleId,
                permissionId: pId
              }))
            })
          }

          // 7) Lấy lại danh sách RolePermission mới nhất
          const updatedRolePermissions = await tx.rolePermission.findMany({
            where: { roleId },
            include: {
              permission: {
                select: {
                  id: true,
                  name: true,
                  description: true
                }
              }
            }
          })

          return updatedRolePermissions
        })
      }
    )
  }
}
