import { NextFunction,Router, Request, Response } from "express";
import { RoleController } from "@/controllers";
import { requirePermission } from "@/middleware/authorization";

import type { Role } from "@/models";

const router = Router();

router.get(
  '/',
  requirePermission('get_role'),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1
      const pageSize = parseInt(req.query.pageSize as string, 10) || 10
      const result = await RoleController.getAll({ page, pageSize })

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
    requirePermission("get_role"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = Number(req.params.id);
            if (!id) {
                res.status(400).json({ message: "ID de rol requerido." });
                return;
            }
            const role = await RoleController.getById(id);
            if (!role) {
                res.status(404).json({ message: "Rol no encontrado." });
                return;
            }
            res.json(role);
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).json({ message: error.message });
            } else {
                next(error);
            }
        }
    }
);

router.post(
    "/",
    requirePermission("create_role"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { name, description, permissionIds } = req.body;
            if (!name) {
                res.status(400).json({ message: "Nombre de rol es requerido." });
                return;
            }
            const role = await RoleController.createRole(name, description, permissionIds);
            res.status(201).json(role);
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).json({ message: error.message });
                return;
            }else{
                next(error);
            }
        }
    }
);

router.put(
    "/:id", 
    requirePermission("edit_role"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { name, description } = req.body;
            let permissionIds = req.body.permissionIds || [];

            const updates: Partial<Role> = {};
            updates.id = Number(req.params.id);;
            if (!updates.id) {
                res.status(400).json({ message: "ID de rol requerido." });
                return;
            }
            if (name !== undefined) updates.name = name;
            if (description !== undefined) updates.description = description;
            if (permissionIds === undefined) permissionIds = [];

            const role = await RoleController.updateRole(updates, permissionIds);
            if (!role) {
                res.status(404).json({ message: "Rol no encontrado." });
                return;
            }
            res.json(role);
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).json({ message: error.message });
                return;
            } else {
                next(error);
            }
        }
    }
);

router.delete(
    "/:id",
    requirePermission("delete_role"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = Number(req.params.id);
            if (!id) {
                res.status(400).json({ message: "ID de rol requerido." });
                return;
            }

            const deleted = await RoleController.deleteRole(id);
            if (!deleted) {
                res.status(404).json({ message: "Rol no encontrado." });
                return;
            }

            res.status(204).send();
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).json({ message: error.message });
            }else{
                next(error);
            }
        }
    }
);

export default router;
