import reasonPhrases from '~/utils/reasonPhrases'
import statusCodes from '~/utils/statusCodes'

export class ErrorResponse extends Error {
  status: number
  details?: any
  constructor(message: string, status: number, details?: any) {
    super(message)
    this.status = status
    this.details = details
  }
}

export class ConflictError extends ErrorResponse {
  constructor(message: string = reasonPhrases.CONFLICT, statuscode: number = statusCodes.CONFLICT) {
    super(message, statuscode)
  }
}

export class BadRequest extends ErrorResponse {
  constructor(
    message: string = reasonPhrases.BAD_REQUEST,
    statuscode: number = statusCodes.BAD_REQUEST,
    details?: any
  ) {
    super(message, statuscode, details)
  }
}

export class UNAUTHORIZED extends ErrorResponse {
  constructor(message: string = reasonPhrases.UNAUTHORIZED, statuscode: number = statusCodes.UNAUTHORIZED) {
    super(message, statuscode)
  }
}

export class NotFoundError extends ErrorResponse {
  constructor(message: string = reasonPhrases.NOT_FOUND, statuscode: number = statusCodes.NOT_FOUND) {
    super(message, statuscode)
  }
}

export class ForbiddenError extends ErrorResponse {
  constructor(message: string = reasonPhrases.FORBIDDEN, statuscode: number = statusCodes.FORBIDDEN) {
    super(message, statuscode)
  }
}

export class InternalServerError extends ErrorResponse {
  constructor(
    message: string = reasonPhrases.INTERNAL_SERVER_ERROR,
    statuscode: number = statusCodes.INTERNAL_SERVER_ERROR
  ) {
    super(message, statuscode)
  }
}

/**
 * Lỗi khi dữ liệu không hợp lệ
 * Ví dụ: Dữ liệu không đúng định dạng, thiếu trường bắt buộc, ...
 */
export class UnprocessableEntity extends ErrorResponse {
  constructor(
    message: string = reasonPhrases.UNPROCESSABLE_ENTITY,
    statuscode: number = statusCodes.UNPROCESSABLE_ENTITY
  ) {
    super(message, statuscode)
  }
}
