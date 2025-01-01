import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import { UnprocessableEntity } from "~/core/error.response.ts";

export const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error: any) {
    if (error.errors) {

      const formattedErrors = error.errors.map((err: any) => `${err.path.join('.')}: ${err.message}`);
      next(new UnprocessableEntity(formattedErrors));
    } else {
      next(error);
    }
  }
};