import { Router } from 'express'
import type { RequestController } from '../controllers/requestController'
import { validate, validateParams } from '../middleware/validate'
import { createRequestSchema, updateRequestSchema, idParamSchema } from '../schemas/requestSchema'

export function createRequestRouter(controller: RequestController): Router {
  const router = Router()
  router.get('/', controller.getAll)
  router.post('/', validate(createRequestSchema), controller.create)
  router.patch('/:id', validateParams(idParamSchema), validate(updateRequestSchema), controller.updateStatus)
  return router
}
