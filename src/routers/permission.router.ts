import express from 'express'
import { asyncHandler } from '~/helper/errorHandle.ts'
import { PermissionController } from '~/controllers/permission.controller.ts'

const router = express.Router()

const permissionController = new PermissionController()

router.get('/', asyncHandler(permissionController.getPermissions))
router.get('/:id', asyncHandler(permissionController.getPermissionById))
router.post('/', asyncHandler(permissionController.createPermission))
router.put('/', asyncHandler(permissionController.updatePermission))
router.delete('/:id', asyncHandler(permissionController.deletePermission))
router.put('/:id/reset', asyncHandler(permissionController.resetPermission))

export default router
