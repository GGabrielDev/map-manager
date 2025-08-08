import { NextFunction, Router, Request, Response } from "express";
import { allUsers, searchUserById, createUser, updateUser, deleteUser} from "@/controllers/User";
import { requirePermission } from "@/middleware/authorization";
import { User } from "@/models/";

const router = Router();

router.get(
    "/users",
    requirePermission("get_user"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const users = await allUsers();
            res.json(users);
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).json({ message: error.message });
            }else{
                next(error);
            }
        }
    }
);

router.get(
    "/users/:id",
    requirePermission("get_user"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = await searchUserById(Number(req.params.id));
            if (!user) {
                res.status(404).json({ message: "Usuario no encontrado." });
                return;
            }
            res.json(user);
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).json({ message: error.message });
            }else{
                next(error);
            }
        }
    }
);

router.post(
    "/users",
    requirePermission("create_user"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { username, password, roleIds } = req.body;

            if (!username) {
                res.status(400).json({ message: "Usuario es requerido." });
                return;
            }
            if (!password) {
                res.status(400).json({ message: "Contraseña es requerida." });
                return;
            }

            const user = await createUser(username, password, roleIds);
            res.status(201).json(user);
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).json({ message: error.message });
            }else{
                next(error);
            }
        }
    }
);

router.put(
    "/users/:id",
    requirePermission("edit_user"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { username, password} = req.body;
            let roleIds = req.body.roleIds || [];

            const updates: Partial<User> = {}
            updates.id = Number(req.params.id);
            if (!updates.id) {
                res.status(400).json({ message: "ID de usuario es requerido." });
                return;
            }
            if (username !== undefined) updates.username = username
            if (password !== undefined) updates.passwordHash = password
            if (roleIds === undefined) roleIds = []

            const user = await updateUser(updates, roleIds);
            if (!user) {
                res.status(404).json({ message: "Usuario no encontrado." });
                return;
            }
            res.json(user);
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).json({ message: error.message });
            }else{
                next(error);
            }
        }
    }
);

router.delete(
    "/users/:id",
    requirePermission("delete_user"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
                next(error);
            }
        }
    }
);

export default router;