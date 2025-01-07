import express from 'express'
import { asyncHandler } from '~/helper/errorHandle.ts'
import { AuthController } from '~/controllers/auth.controller.ts'

const router = express.Router()

const authController = new AuthController()

router.post('/login', asyncHandler(authController.login))
router.post('/register', asyncHandler(authController.register))

export default router
