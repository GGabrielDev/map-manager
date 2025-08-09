import cors from 'cors'
import express from 'express'

import mainRouter from '@/routes/'

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

// TODO: Jhonnatan: Revisar applicacion de los controladores con paginacion en las rutas
app.use('/api', mainRouter)

export default app
