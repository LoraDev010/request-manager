import { Router } from 'express'
import { RequestController } from '../controllers/requestController'
import { RequestService } from '../services/requestService'
import { InMemoryRequestRepository } from '../repositories/InMemoryRequestRepository'
import { validate } from '../middleware/validate'
import { createRequestSchema, updateRequestSchema } from '../schemas/requestSchema'

const router = Router()
const repository = new InMemoryRequestRepository()
const service = new RequestService(repository)
const controller = new RequestController(service)

router.get('/', controller.getAll)
router.post('/', validate(createRequestSchema), controller.create)
router.patch('/:id', validate(updateRequestSchema), controller.updateStatus)

export default router
