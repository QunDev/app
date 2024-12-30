import {NextFunction, Request, Response} from 'express';
import {AuthFailureError, ValidationError} from "~/core/error.response.ts";
import {createApiKeySchema} from "~/validations/apiKey.validation.ts";
import {asyncHandler} from "~/helper/errorHandle.ts";
import {ApiKeyService} from "~/services/apiKeyService.ts";

/**
 * Middleware to validate the provided `x-api-key`, check its status, and enforce restrictions.
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express NextFunction
 */

const apiKeyMiddleware = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.header('x-api-key'); // Retrieve `x-api-key` header

  // Step 1: Check if the API Key is provided
  if (!apiKey) {
    throw new AuthFailureError('Unauthorized: Not authorized to access this resource');
  }

  const apiKeyRecord = await ApiKeyService.validateApiKey(apiKey as string);

  // Step 2: Check if the API Key is valid
  if (!apiKeyRecord) {
    throw new AuthFailureError('Invalid API Key');
  }

  req.apiKeyRecord = apiKeyRecord;
  next();
  return;
});

/**
 * Middleware to validate API Key creation payload.
 */
export const validateCreateApiKey = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate the request body using Zod schema
    createApiKeySchema.parse(req.body);
    next(); // Proceed to the next middleware if valid
  } catch (error: any) {
    // If validation fails, throw a ValidationError with all issues
    if (error.errors) {
      const validationIssues = error.errors.map((err: any) => `${err.path.join('.')}: ${err.message}`);
      throw new ValidationError(validationIssues, 'Invalid API Key creation payload');
    }
    next(error);
  }
});

export default apiKeyMiddleware;