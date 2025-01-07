import express from 'express'
import { RoleController } from '~/controllers/role.controller.ts'
import { asyncHandler } from '~/helper/errorHandle.ts'

const router = express.Router()

const roleController = new RoleController()

router.get('/', asyncHandler(roleController.getRoles))
router.get('/:id', asyncHandler(roleController.getRoleById))
router.post('/', asyncHandler(roleController.createRole))
router.put('/', asyncHandler(roleController.updateRole))
router.delete('/:id', asyncHandler(roleController.deleteRole))
router.put('/:id/reset', asyncHandler(roleController.resetRole))

export default router
