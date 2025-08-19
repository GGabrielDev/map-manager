import { NextFunction, Router, Request, Response } from "express";
import { UserController } from "@/controllers";
import { requirePermission } from "@/middleware/authorization";

import type { User } from "@/models";

const router = Router();

router.get(
  '/',
  requirePermission('get_user'),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1
      const pageSize = parseInt(req.query.pageSize as string, 10) || 10
      const username = (req.query.username as User['username']) || undefined
      const sortBy = UserController.SortByOptions.includes(req.query.sortBy as string)
        ? (req.query.sortBy as UserController.UserFilterOptions['sortBy'])
        : undefined
      const sortOrder = (req.query.sortOrder as 'ASC' | 'DESC') || 'ASC'

      const result = await UserController.getAll({
        page,
        pageSize,
        username,
        sortBy,
        sortOrder,
      })

      res.json(result)
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message })
      } else {
        next(error)
      }
    }
  }
)

router.get(
    "/:id",
    requirePermission("get_user"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = parseInt(req.params.id, 10)
            const user = await UserController.getById(userId);
            
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
    "/",
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

            const user = await UserController.createUser(username, password, roleIds);
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
    "/:id",
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

            const user = await UserController.updateUser(updates, roleIds);
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
    "/:id",
    requirePermission("delete_user"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = Number(req.params.id);
            if (!id) {
                res.status(400).json({ message: "ID de usuario es requerido." });
            }

            await UserController.deleteUser(id);
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
