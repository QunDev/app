import { asyncHandler } from '~/helper/errorHandle.ts'
import { NextFunction, Request, Response } from 'express'
import { UNAUTHORIZED } from '~/core/error.response.ts'
import { prisma } from '~/utils/prismaClient.ts'

export function checkPermission(...requiredPermissions: string[]) {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // 1) Lấy user từ req hoặc JWT
    const currentUser = req.user
    if (!currentUser) {
      // Nếu user chưa đăng nhập -> 401
      throw new UNAUTHORIZED('Unauthorized: User is not logged in')
    }

    // 2) Lấy user từ DB (kèm roles -> permissions)
    //    Chỉ lấy permission isDeleted = false, role isDeleted = false
    const userWithRoles = await prisma.user.findUnique({
      where: { id: currentUser.userId },
      select: {
        id: true,
        name: true,
        isDeleted: true, // (nếu trong schema có cột isDeleted - tuỳ bạn)
        roles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
                isDeleted: true,
                permissions: {
                  select: {
                    permission: {
                      select: {
                        id: true,
                        name: true,
                        isDeleted: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })
    if (!userWithRoles) {
      // User không tồn tại
      throw new UNAUTHORIZED('Unauthorized: User does not exist')
    }

    // (Tuỳ bạn) Nếu user có cột isDeleted, check -> cấm
    if (userWithRoles.isDeleted) {
      throw new UNAUTHORIZED('Unauthorized: User is banned')
    }

    // 3) Gom tất cả permission (chưa bị xóa) mà user có qua role
    const userPermissionSet = new Set<string>()
    for (const userRole of userWithRoles.roles) {
      // Bỏ qua role đã bị xóa (isDeleted)
      if (userRole.role.isDeleted) continue

      // Duyệt danh sách permissions
      for (const rp of userRole.role.permissions) {
        if (!rp.permission.isDeleted) {
          userPermissionSet.add(rp.permission.name)
        }
      }
    }

    // 4) Kiểm tra user có đủ tất cả requiredPermissions không
    const missing = requiredPermissions.filter((p) => !userPermissionSet.has(p))
    if (missing.length > 0) {
      // Chưa đủ quyền
      throw new UNAUTHORIZED(`Unauthorized: Missing permissions: ${missing.join(', ')}`)
    }
    // 5) Nếu đủ quyền => next()
    return next()
  })
}
