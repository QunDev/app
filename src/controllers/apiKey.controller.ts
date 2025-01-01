import { Request, Response, NextFunction } from "express";
import { generateApiKeyService, revokeApiKeyService } from "~/services/apiKey.service.ts";
import { createApiKeySchema } from "~/validations/apiKey.validation.ts";
import { asyncHandler } from "~/helper/errorHandle.ts";
import { CREATED, OK } from "~/core/success.response.ts";

export const generateApiKeyController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const validatedData = createApiKeySchema.parse(req.body);
  const apiKey = await generateApiKeyService(validatedData);

  new CREATED({ message: "API key generated successfully", metadata: apiKey }).send(res);
});

export const revokeApiKeyController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { key } = req.params;
  const apiKey = await revokeApiKeyService(key);

  new OK({ message: "API key revoked successfully", metadata: apiKey }).send(res);
});