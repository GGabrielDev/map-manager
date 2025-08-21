import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "@/controllers";
import { authenticateToken } from "@/middleware/authentication";

import { HttpError } from "@/utils/error-utils"

const router = Router();

router.post(
    "/login",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, password } = req.body;
    
            // validate request body
            if(!username){
                throw new HttpError("Nombre de usuario requerido", 400, "missing_username", {field: "username"});
            }
            if(!password){
                throw new HttpError("Contraseña requerida", 400, "missing_password", {field: "password"});
            }
    
            const token = await UserController.login(username, password);
            res.json({ token });
        } catch (error) {
            if (error instanceof HttpError) {
                next(error);
            } else {
                next(new HttpError("Error al iniciar sesión", 500, "login_failed", {field: "Error en el archivo: auth"}));
            }
        }
    }
)

router.get(
    "/validate",
    authenticateToken,
    async (_, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.json({valid: true})
        } catch (error) {
            next(new HttpError("Error al validar token", 500, "token_validation_failed", {field: "Error en el archivo: auth"}));
        }
    }
)

router.get(
    "/me",
    authenticateToken,
    async (req: Request, res: Response, next): Promise<void> => {
        try {
            const id = req.userId;

            if (typeof id !== 'number') {
                throw new HttpError("ID de usuario no válido", 400, "Invalid_data", {field: "id"});
            }

            const user = await UserController.getById(id);
            res.json(user);
        } catch (error) {
            if (error instanceof HttpError) {
                next(error);
            } else {
                next(new HttpError("Error al obtener usuario", 500, "user_fetch_failed", {field: "Error en el archivo: auth"}));
            }
        }
    }
)

export default router;
