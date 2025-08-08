import express from 'express'

import UserRouter from '@/routes/User'
import RoleRouter from '@/routes/Role'
import PermissionRouter from '@/routes/Permission';
import AuthRouter from '@/routes/auth'
import { authenticateToken } from '@/middleware/authentication';

// Initialize express app

const mainRouter = express()

mainRouter.use(express.json())

// Ruta de autenticación y autorización (sin permiso)
mainRouter.use('/auth', AuthRouter)

// Rutas de usuarios, roles y permisos (con permisos)
mainRouter.use(authenticateToken)

mainRouter.use('/users', UserRouter)
mainRouter.use('/permissions', PermissionRouter)
mainRouter.use('/roles', RoleRouter)

export default mainRouter
