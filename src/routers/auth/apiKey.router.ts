import express from 'express';
import {validateCreateApiKey} from "~/middlewares/apiKey.middleware.ts";
import {asyncHandler} from "~/helper/errorHandle.ts";
import ApiKeyController from "~/controllers/apiKeyController.ts";

const router = express.Router();

router.post('/capikey', validateCreateApiKey, asyncHandler(ApiKeyController.createApiKey));

export default router;