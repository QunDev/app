import {asyncHandler} from "~/helper/errorHandle.ts";
import {NextFunction, Request, Response} from "express";
import {ValidationError} from "~/core/error.response.ts";
import {signUpUserSchema} from "~/validations/auth.validation.ts";

export const validateSignUp = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate the request body using Zod schema
    signUpUserSchema.parse(req.body);
    next(); // Proceed to the next middleware if valid
  } catch (error: any) {
    // If validation fails, throw a ValidationError with all issues
    if (error.errors) {
      const validationIssues = error.errors.map((err: any) => `${err.path.join('.')}: ${err.message}`);
      throw new ValidationError(validationIssues, 'Validation failed');
    }
    next(error);
  }
});