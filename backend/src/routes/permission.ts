import { Router, NextFunction, Request, Response } from "express";
import {  requirePermission } from "@/middleware/authorization"
import { PermissionController } from "@/controllers";

const router = Router();

router.get(
  '/',
  requirePermission('get_permission'),
  async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1
      const pageSize = parseInt(req.query.pageSize as string, 10) || 10
      const result = await PermissionController.getAll({
        page,
        pageSize,
      })
      res.json(result)
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' })
      }
    }
  }
)

router.get(
    "/:id",
    requirePermission("get_permission"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const permission = await PermissionController.getById(Number(req.params.id));
            if (!permission) {
                res.status(404).json({ message: "Permiso no encontrado." });
                return;
            }
            res.json(permission); 
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
