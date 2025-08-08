import express, { Request, Response, Router } from "express";
import { loginUser, searchUserById } from "@/controllers/User";
import { authenticateToken } from "@/middleware/authentication";

const router = Router();

router.post(
    "/login",
    async (req: Request, res: Response) => {
        const { username, password } = req.body;

        // validate request body
        if(!username){
            return res.status(400).json({ message: "Usuario requerido" });
        }
        if(!password){
            return res.status(400).json({ message: "Contraseña requerida" });
        }

        try {
            const token = await loginUser(username, password);
            res.json({ token });
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).json({ message: error.message });
            }else{
                res.status(500).json({ message: "Error inesperado" });
            }
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
    async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.userId;

            if (typeof id !== 'number') {
                res.status(401).json({ message: "ID de usuario inválido." });
                return;
            }

            const user = await searchUserById(id);
            
            if (!user) {
                res.status(404).json({ message: "Usuario no encontrado." });
                return;
            }

            res.json({ user });
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Error inesperado" });
            }
        }
    }
)

export default router;