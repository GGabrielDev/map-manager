import express from 'express'

import UserRouter from '@/routes/user'
import RoleRouter from '@/routes/role'
import PermissionRouter from '@/routes/permission'
import AuthRouter from '@/routes/auth'
import StateRouter from '@/routes/state'
import MunicipalityRouter from '@/routes/municipality'
import { authenticateToken } from '@/middleware/authentication'

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
mainRouter.use('/states', StateRouter)
mainRouter.use('/municipalities', MunicipalityRouter)

export default mainRouter
