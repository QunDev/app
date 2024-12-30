import {asyncHandler} from "~/helper/errorHandle.ts";
import {ValidationError} from "~/core/error.response.ts";
import {NextFunction, Request, Response} from "express";
import {createPhoneSchema} from "~/validations/phone.validation.ts";

export const validateCreatePhone = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(2)
    createPhoneSchema.parse(req.body);
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