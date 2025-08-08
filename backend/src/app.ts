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
// TODO: Refactorizar router en archivos separados
// Ruta de autenticación y autorización (sin permiso)
app.use('/auth', AuthRouter)

// Rutas de usuarios, roles y permisos (con permisos)
app.use(authenticateToken)  

app.use('/users', UserRouter)
app.use('/permissions', PermissionRouter)
app.use('/roles', RoleRouter)

// TODO: Implementar todas las demas rutas dentro de este main router
app.use('/api', mainRouter)

export default app
