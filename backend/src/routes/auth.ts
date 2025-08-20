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
                throw new HttpError("Nombre de usuario requerido", 400, "missing_username", "auth");
            }
            if(!password){
                throw new HttpError("Contraseña requerida", 400, "missing_password", "auth");
            }
    
            const token = await UserController.login(username, password);
            res.json({ token });
        } catch (error) {
            next(new HttpError("Error al iniciar sesión", 500, "login_failed", "auth"));
        }
    }
)

router.get(
    "/validate",
    authenticateToken,
    async (_, res: Response): Promise<void> => {
        res.json({valid: true})
    }
)

router.get(
    "/me",
    authenticateToken,
    async (req: Request, res: Response, next): Promise<void> => {
        try {
            const id = req.userId;

            if (typeof id !== 'number') {
                throw new HttpError("ID de usuario no válido", 400, "Invalid_data", "auth");
            }

            const user = await UserController.getById(id);
            res.json(user);
        } catch (error) {
            next(error)
        }
    }
)

export default router;
