import { NextFunction,Router, Request, Response } from "express";
import { allRoles, searchRoleById, createRole, updateRole, deleteRole } from "@/controllers/Role";
import { requirePermission } from "@/middleware/authorization";
import { Role } from "@/models/";

const router = Router();

router.get(
    "/roles",
    requirePermission("get_role"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const roles = await allRoles();
            res.json(roles);
        }catch (error) {
            if (error instanceof Error) {
                res.status(401).json({ message: error.message });
            } else {
                next(error);
            }
        }
    }
);

router.get(
    "/roles/:id",
    requirePermission("get_role"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = Number(req.params.id);
            if (!id) {
                res.status(400).json({ message: "ID de rol requerido." });
                return;
            }
            const role = await searchRoleById(id);
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
    "/roles",
    requirePermission("create_role"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { name, description, permissionIds } = req.body;
            if (!name) {
                res.status(400).json({ message: "Nombre de rol es requerido." });
                return;
            }
            const role = await createRole(name, description, permissionIds);
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
    "/roles/:id", 
    requirePermission("update_role"),
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

            const role = await updateRole(updates, permissionIds);
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
    "/roles/:id",
    requirePermission("delete_role"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = Number(req.params.id);
            if (!id) {
                res.status(400).json({ message: "ID de rol requerido." });
                return;
            }

            const deleted = await deleteRole(id);
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