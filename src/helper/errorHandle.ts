import {Request, Response, NextFunction} from "express";
import {ErrorResponse, ValidationError} from "~/core/error.response.ts";
import statusCodes from "~/utils/statusCodes.ts";

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Global error-handling middleware for catching and handling errors.
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Handle ValidationError or ErrorResponse
  if (err instanceof ErrorResponse) {
    res.status(err.status).json({
      success: false,
      message: err.message,
      ...(err instanceof ValidationError && {errors: err.errors}), // Include errors if ValidationError
    });
    return;
  }

  // Handle unexpected errors (fallback)
  res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Internal Server Error",
    error: err.message || "Something went wrong",
  });
  return;
};