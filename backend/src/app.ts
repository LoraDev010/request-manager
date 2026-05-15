import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import requestRoutes from './routes/requestRoutes'
import { errorHandler } from './middleware/errorHandler'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/requests', requestRoutes)

app.use(errorHandler)

const PORT = process.env.PORT ?? 3000

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

export default app
