import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../errors/AppError'
import { ApiResponse } from '../types'

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    const body: ApiResponse<null> = { data: null, error: { code: err.code, message: err.message } }
    res.status(err.statusCode).json(body)
    return
  }

  if (err instanceof ZodError) {
    const message = err.errors.map((e) => e.message).join(', ')
    const body: ApiResponse<null> = { data: null, error: { code: 'VALIDATION_ERROR', message } }
    res.status(400).json(body)
    return
  }

  const body: ApiResponse<null> = { data: null, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } }
  res.status(500).json(body)
}
