import cors from 'cors'
import express from 'express'

import Users from '@/routes/user'
import Roles from '@/routes/role'
import Permissions from '@/routes/permission';
import auth from '@/routes/auth'
import { authenticateToken } from './middleware/authentication';

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

// Ruta de autenticación y autorización (sin permiso)
app.use(auth)

// Rutas de usuarios, roles y permisos (con permisos)
app.use(authenticateToken)  
app.use(Users)
app.use(Roles)
app.use(Permissions)

export default app