import express from 'express'
import { RolePermissionController } from '~/controllers/rolePermissions.controller.ts'
import { asyncHandler } from '~/helper/errorHandle.ts'

const router = express.Router()

const rolePermissionController = new RolePermissionController()

router.get('/', asyncHandler(rolePermissionController.getRolePermissions))
router.get('/role/:id', asyncHandler(rolePermissionController.getRolePermissionByRoleId))
router.get('/:id', asyncHandler(rolePermissionController.getRolePermissionById))
router.post('/', asyncHandler(rolePermissionController.createRolePermission))
router.put('/', asyncHandler(rolePermissionController.updateRolePermission))

export default router
