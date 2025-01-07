import express from 'express'
import advancedIpMiddleware from '~/middlewares/lan.middleware.ts'
import userRouter from '~/routers/user.router.ts'
import apiKeyRouter from '~/routers/apiKey.router.ts'
import permissionRouter from '~/routers/permission.router.ts'
import roleRouter from '~/routers/role.router.ts'
import countryPhoneRouter from '~/routers/countryPhone.router.ts'
import phoneRouter from '~/routers/phone.router.ts'
import appRouter from '~/routers/app.router.ts'
import backupRouter from '~/routers/backup.router.ts'
import { apiKeyAuthMiddleware } from '~/middlewares/apiKeyAuth.middleware.ts'
import apiKeyRateLimiter from '~/middlewares/rateLimit.middleware.ts'
import accountAppRouter from '~/routers/accountApp.router.ts'
import rolePermissionRouter from '~/routers/rolePermission.router.ts'
import userRoleRouter from '~/routers/userRole.router.ts'
import authRouter from '~/routers/auth.router.ts'
import { checkPermission } from '~/middlewares/checkPermission.middleware.ts'
import { requireAuth } from '~/middlewares/auth.middleware.ts'

const router = express.Router()

// check apiKey
// router.use(apiKeyAuthMiddleware);
// rate limiting
router.use(apiKeyRateLimiter)
// check permission
router.use(advancedIpMiddleware)

router.use('/auth', authRouter)

router.use(requireAuth)

router.use(checkPermission('Create', 'Read', 'Write', 'Update', 'Delete'))

router.use('/users', userRouter)
router.use('/apikey', apiKeyRouter)
router.use('/permissions', permissionRouter)
router.use('/roles', roleRouter)
router.use('/countryPhones', countryPhoneRouter)
router.use('/phones', phoneRouter)
router.use('/apps', appRouter)
router.use('/backups', backupRouter)
router.use('/accountApps', accountAppRouter)
router.use('/permission', permissionRouter)
router.use('/rolePermission', rolePermissionRouter)
router.use('/userRole', userRoleRouter)

export default router
