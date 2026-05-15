export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(404, 'REQUEST_NOT_FOUND', message)
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Request already processed') {
    super(409, 'REQUEST_ALREADY_PROCESSED', message)
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, 'VALIDATION_ERROR', message)
  }
}
