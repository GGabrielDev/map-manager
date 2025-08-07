import { Router, Request, Response } from "express";
import { allUsers, searchUserById, createUser, updateUser, deleteUser} from "@/controllers/User";
import { requirePermission } from "@/middleware/authorization";
import { User } from "@/models/";

const router = Router();

router.get(
    "/users",
    requirePermission("get_user"),
    async (_, res) => {
        try {
            const users = await allUsers();
            res.json(users);
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).json({ message: error.message });
            }else{
                res.status(500).json({ message: "Error inesperado." });
            }
        }
    }
);

router.get(
    "/users/:id",
    requirePermission("get_user"),
    async (req: Request, res: Response) => {
        try {
            const user = await searchUserById(Number(req.params.id));
            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado." });
            }
            res.json(user);
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).json({ message: error.message });
            }else{
                res.status(500).json({ message: "Error inesperado." });
            }
        }
    }
);
router.post(
    "/users",
    requirePermission("create_user"),
    async (req: Request, res: Response) => {
        try {
            const { username, password, roleIds } = req.body;

            if (!username) {
                return res.status(400).json({ message: "Usuario es requerido." });
            }
            if (!password) {
                return res.status(400).json({ message: "Contraseña es requerida." });
            }

            const user = await createUser(username, password, roleIds);
            res.status(201).json(user);
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).json({ message: error.message });
            }else{
                res.status(500).json({ message: "Error inesperado." });
            }
        }
    }
);
router.put(
    "/users/:id",
    requirePermission("update_user"),
    async (req: Request, res: Response) => {
        try {
            const { username, password} = req.body;
            let roleIds = req.body.roleIds || [];

            const Updates: Partial<User> = {}
            Updates.id = Number(req.params.id);
            if (!Updates.id) {
                return res.status(400).json({ message: "ID de usuario es requerido." });
            }
            if (username !== undefined) Updates.username = username
            if (password !== undefined) Updates.passwordHash = password
            if (roleIds === undefined) roleIds = []


            const user = await updateUser(Updates, roleIds);
            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado." });
            }
            res.json(user);
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).json({ message: error.message });
            }else{
                res.status(500).json({ message: "Error inesperado." });
            }
        }
    }
);
router.delete(
    "/users/:id",
    requirePermission("delete_user"),
    async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Number(req.params.id);
            if (!id) {
                res.status(400).json({ message: "ID de usuario es requerido." });
            }

            await deleteUser(id);
            res.status(204).send();
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Error inesperado." });
            }
        }
    }
);

export default router;