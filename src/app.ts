import cors from 'cors'
import express from 'express'
import { errorHandler } from './shared/middleware/error-handler.js'
import { routes } from './routes.js'

export const app = express()

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? true,
  }),
)
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'hermex-api' })
})

app.use('/api', routes)
app.use(errorHandler)
