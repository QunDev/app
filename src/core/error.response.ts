import reasonPhrases from "~/utils/reasonPhrases";
import statusCodes from "~/utils/statusCodes";

export class ErrorResponse extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export class ConflictError extends ErrorResponse {
  constructor(message: string = reasonPhrases.CONFLICT, statuscode: number = statusCodes.CONFLICT) {
    super(message, statuscode);
  }
}

export class BadRequest extends ErrorResponse {
  constructor(message: string = reasonPhrases.BAD_REQUEST, statuscode: number = statusCodes.BAD_REQUEST) {
    super(message, statuscode);
  }
}

export class AuthFailureError extends ErrorResponse {
  constructor(message: string = reasonPhrases.UNAUTHORIZED, statuscode: number = statusCodes.UNAUTHORIZED) {
    super(message, statuscode);
  }
}

export class NotFoundError extends ErrorResponse {
  constructor(message: string = reasonPhrases.NOT_FOUND, statuscode: number = statusCodes.NOT_FOUND) {
    super(message, statuscode);
  }
}

export class ForbiddenError extends ErrorResponse {
  constructor(message: string = reasonPhrases.FORBIDDEN, statuscode: number = statusCodes.FORBIDDEN) {
    super(message, statuscode);
  }
}

export class ValidationError extends ErrorResponse {
  /**
   * Constructor for Validation Error.
   * @param errors - An array of validation issues or a single validation issue.
   * @param message - Optional custom error message, defaults to "Invalid Request Body".
   * @param statuscode
   */
  constructor(
    public errors: string[] | string = "Validation error",
    message: string = reasonPhrases.BAD_REQUEST,
    statuscode: number = statusCodes.BAD_REQUEST
  ) {
    super(message, statuscode);
  }
}

export class InternalServerError extends ErrorResponse {
  constructor(message: string = reasonPhrases.INTERNAL_SERVER_ERROR, statuscode: number = statusCodes.INTERNAL_SERVER_ERROR) {
    super(message, statuscode);
  }
}