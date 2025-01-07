import express from 'express'
import { UserRoleController } from '~/controllers/userRole.controller.ts'
import { asyncHandler } from '~/helper/errorHandle.ts'

const router = express.Router()

const rolePermissionController = new UserRoleController()

router.get('/', asyncHandler(rolePermissionController.getUserRoles))
router.post('/', asyncHandler(rolePermissionController.createUserRole))
router.put('/', asyncHandler(rolePermissionController.updateUserRole))

export default router
