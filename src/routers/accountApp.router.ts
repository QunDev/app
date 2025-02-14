import express from 'express'
import {AccountAppController} from "~/controllers/accountApp.controller.ts";
import {asyncHandler} from "~/helper/errorHandle.ts";

const router = express.Router()

const accountAppController = new AccountAppController()

router.get('/getall/:appId', asyncHandler(accountAppController.listAccountApps))
router.post('/', asyncHandler(accountAppController.createAccountApp))
router.post('/many', asyncHandler(accountAppController.createAccountAppMany))
router.get('/sms-null/:appid/:userid', asyncHandler(accountAppController.getAccountAppWhereSmsIsNull))
router.get('/:id', asyncHandler(accountAppController.getAccountApp))
router.put('/:id', asyncHandler(accountAppController.updateAccountApp))
router.delete('/:id', asyncHandler(accountAppController.deleteAccountApp))

export default router
