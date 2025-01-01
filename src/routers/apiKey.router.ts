import express from "express";
import { generateApiKeyController, revokeApiKeyController } from "~/controllers/apiKey.controller.ts";
import { validate } from "~/middlewares/validation.middleware.ts";
import { createApiKeySchema } from "~/validations/apiKey.validation.ts";

const router = express.Router();

router.post("/generate", validate(createApiKeySchema), generateApiKeyController);
router.post("/revoke/:key", revokeApiKeyController);

export default router;