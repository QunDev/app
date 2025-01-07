import express from 'express'
import { UserController } from '~/controllers/user.controller.ts'
import { asyncHandler } from '~/helper/errorHandle.ts'

const router = express.Router()

const userController = new UserController()

export default router
