import express from 'express'
import { EmailController } from '~/controllers/email.controller.ts'
import { asyncHandler } from '~/helper/errorHandle.ts'

const router = express.Router()
const emailController = new EmailController()

router.get('/', asyncHandler(emailController.getEmails))
router.get('/:id', asyncHandler(emailController.getEmail))
router.post('/', asyncHandler(emailController.createEmails))
router.put('/:id', asyncHandler(emailController.updateEmail))
router.delete('/:id', asyncHandler(emailController.deleteEmail))
router.delete('/', asyncHandler(emailController.deleteAllEmails))
router.get('/random', asyncHandler(emailController.getRandomEmail))

export default router
