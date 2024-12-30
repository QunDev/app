import {asyncHandler} from "~/helper/errorHandle.ts";
import {createAppSchema} from "~/validations/app.validation.ts";
import {ValidationError} from "~/core/error.response.ts";
import {NextFunction, Request, Response} from "express";

export const validateCreateApp = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  try {
    createAppSchema.parse(req.body);
    next();
  } catch (error: any) {
    // If validation fails, throw a ValidationError with all issues
    if (error.errors) {
      const validationIssues = error.errors.map((err: any) => `${err.path.join('.')}: ${err.message}`);
      throw new ValidationError(validationIssues, 'Validation failed');
    }
    next(error);
  }
})