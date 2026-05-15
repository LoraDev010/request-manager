import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import { createRequestRouter } from './routes/requestRoutes'
import { errorHandler } from './middleware/errorHandler'
import { InMemoryRequestRepository } from './repositories/InMemoryRequestRepository'
import { RequestService } from './services/requestService'
import { RequestController } from './controllers/requestController'

const repository = new InMemoryRequestRepository()
const service = new RequestService(repository)
const controller = new RequestController(service)

const app = express()

app.use(helmet())
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN ?? 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH'],
  allowedHeaders: ['Content-Type'],
  credentials: false,
}))
app.use(rateLimit({ windowMs: 60_000, limit: 60, standardHeaders: true, legacyHeaders: false }))
app.use(express.json({ limit: '10kb' }))

app.use('/requests', createRequestRouter(controller))

app.use(errorHandler)

const PORT = process.env.PORT ?? 3000

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

export default app
