import { Router, NextFunction, Request, Response } from "express";
import {  requirePermission} from "@/middleware/authorization"
import { allPermissions, searchPermissionById } from "@/controllers/Permission";

const router = Router();

router.get(
    "/permissions",
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const permissions = await allPermissions();
            res.json(permissions);
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).json({ message: error.message });
            } else {
                next(error);
            }
        }
    }
);

router.get(
    "/permissions/:id",
    requirePermission("get_permission"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            
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