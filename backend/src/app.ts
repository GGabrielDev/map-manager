import cors from 'cors'
import express from 'express'

import Users from '@/routes/User'

const app = express()

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

app.use(express.json())
app.use(Users)

export default app