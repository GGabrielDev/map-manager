import cors from 'cors'
import express from 'express'

import mainRouter from '@/routes/'

import { errorHandler } from "@/middleware/errorHandler";

// Initialize express app

const app = express()

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

app.use(express.json())

app.use('/api', mainRouter)

app.use(errorHandler)

export default app