import StatusCodes from '~/utils/statusCodes.ts'
import ReasonPhrases from '~/utils/reasonPhrases.ts'
import { undefined } from 'zod'

export class SuccessResponse {
  message: string
  status: number
  metadata: any
  constructor({
    message,
    statusCode = StatusCodes.OK,
    reasonStatusCode = ReasonPhrases.OK,
    metadata = {}
  }: {
    message: string
    statusCode?: number
    reasonStatusCode?: string
    metadata: any
  }) {
    this.message = !message ? reasonStatusCode : message
    this.status = statusCode
    this.metadata = metadata
  }

  send(res: any) {
    res.status(this.status).json(this)
  }
}

export class OK extends SuccessResponse {
  constructor({ message, metadata }: { message: string; metadata: any }) {
    super({ message, metadata })
  }
}

export class NO_CONTENT extends SuccessResponse {
  constructor({ message }: { message: string }) {
    super({
      metadata: undefined,
      message,
      statusCode: StatusCodes.NO_CONTENT,
      reasonStatusCode: ReasonPhrases.NO_CONTENT
    })
  }
}

export class CREATED extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.CREATED,
    reasonStatusCode = ReasonPhrases.CREATED,
    metadata
  }: {
    message: string
    statusCode?: number
    reasonStatusCode?: string
    metadata?: any
  }) {
    super({ message, statusCode, reasonStatusCode, metadata })
  }
}
