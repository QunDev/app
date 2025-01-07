import express from 'express'
import {ApiKeyController} from "~/controllers/apiKey.controller.ts";
import {asyncHandler} from "~/helper/errorHandle.ts";

const router = express.Router()

const apiKeyController = new ApiKeyController()

router.post('/generate', asyncHandler(apiKeyController.generateApiKey))
router.post('/revoke/:key', asyncHandler(apiKeyController.revokeApiKey))

export default router
