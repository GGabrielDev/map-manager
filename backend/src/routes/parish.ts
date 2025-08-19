import { NextFunction, Router, Request, Response } from "express";
import { ParishController } from "@/controllers";
import { requirePermission } from "@/middleware/authorization";
import { Parish } from "@/models";

const router = Router();

router.get(
    "/",
    requirePermission("get_parish"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try {
            const page = parseInt(req.body.page as string, 10) || 1
                const pageSize = parseInt(req.body.pageSize as string, 10) || 10
                const name = (req.body.name as Parish['name']) || undefined
                const sortBy = ParishController.SortByOptions.includes(req.query.sortBy as string)
                    ? (req.query.sortBy as ParishController.ParishFilterOptions['sortBy'])
                    : undefined
                const sortOrder = (req.query.sortOrder as 'ASC' | 'DESC') || 'ASC'

            const parishes = await ParishController.allParish({
                page,
                pageSize,
                name,
                sortBy,
                sortOrder
            })
            res.json(parishes)
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).json({message: error.message})
            }else{
                next(error)
            }
        }
    }
)

router.get(
    "/:id",
    requirePermission("get_parish"),
    async(req: Request, res: Response, next: NextFunction): Promise <void> =>{
        try {
            const parishId = parseInt(req.params.id, 10)
            const parish = await ParishController.getById(parishId)
            if (!parish) {
                res.status(404).json({message: "Parroquia no encontrada"})
                return;
            }
            res.json(parish);
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).json({message: error.message})
            } else {
                next(error)
            }
        }
    }
)

router.post(
    "/",
    requirePermission("create_parish"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try {
            const {name, municipalityId} = req.body
            if (!name) {
                res.status(400).json({message: "Nombre de la parroquia requerido"})
                return;
            }
            if (!municipalityId) {
                res.status(400).json({message: "ID del municipio requerido"})
                return;
            }

            const newParish = await ParishController.createParish(name, municipalityId)
            res.status(201).json(newParish)
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).json({message: error.message})
            } else {
                next(error)
            }
        }
    }
)

router.put(
    "/:id",
    requirePermission("edit_parish"),
    async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const updates: Partial<Parish> = {}
            updates.id= Number(req.params.id)
            if (!updates.id) {
                res.status(400).json({ message: "ID de la parroquia requerido." })
                return;
            }
            if (req.body.name !== undefined) updates.name = req.body.name;
            if (req.body.municipalityId !== undefined) updates.municipalityId = req.body.municipalityId

            const updateParish = await ParishController.updateParish(updates)
            if (!updateParish) {
                res.status(404).json({ message: "Parroquia no encontrada." })
                return;
            }
            res.json(updateParish)
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).json({message: error.message})
            } else {
                next(error)
            }
        }
    }
)

router.delete(
    "/:id",
    requirePermission("delete_parish"),
    async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try {
            const id = Number(req.params.id)
            if (!id) {
                res.status(400).json({ message: "ID de parroquia requerido" })
                return;
            }

            await ParishController.deleteParish(id);
            res.status(204).send()
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).json({ message: error.message })
                return;
            } else {
                next(error)
            }
        }
    }
)

export default router;