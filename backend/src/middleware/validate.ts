import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'

export const validate = (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body ?? {})
      next()
    } catch (err) {
      next(err)
    }
  }

export const validateParams = (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.params)
      next()
    } catch (err) {
      next(err)
    }
  }
