import { NextFunction, Router, Request, Response } from "express";
import { ParishController } from "@/controllers";
import { requirePermission } from "@/middleware/authorization";
import { Parish } from "@/models";

import { HttpError } from "@/utils/error-utils";

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
            if (error instanceof HttpError) {
                next(error)
            }else{
                next(new HttpError("Error al obtener las parroquias.", 500, "parish_fetch_failed", {field: "Error en el archivo: parish"}));
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
            if(!parishId){
                throw new HttpError("ID de parroquia requerido.", 400, "missing_parish_id", {field: "id"});
            }

            const parish = await ParishController.getById(parishId)
            res.json(parish);
        } catch (error) {
            if (error instanceof HttpError) {
                next(error)
            } else {
                next(new HttpError("Error al obtener la parroquia.", 500, "parish_fetch_failed", {field: "Error en el archivo: parish"}));
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
                throw new HttpError("Nombre de la parroquia requerido.", 400, "missing_parish_name", {field: "name"});
            }
            if (!municipalityId) {
                throw new HttpError("ID del municipio requerido.", 400, "missing_municipality_id", {field: "municipalityId"});
            }

            const newParish = await ParishController.createParish(name, municipalityId)
            res.status(201).json(newParish)
        } catch (error) {
            if (error instanceof HttpError) {
                next(error)
            } else {
                next(new HttpError("Error al crear la parroquia.", 500, "parish_creation_failed", {field: "Error en el archivo: parish"}));
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
                throw new HttpError("ID de parroquia requerido.", 400, "missing_parish_id", {field: "id"});
            }
            if (req.body.name !== undefined) updates.name = req.body.name;
            if (req.body.municipalityId !== undefined) updates.municipalityId = req.body.municipalityId

            const updateParish = await ParishController.updateParish(updates)
            res.json(updateParish)
        } catch (error) {
            if (error instanceof HttpError) {
                next(error)
            } else {
                next(new HttpError("Error al actualizar la parroquia.", 500, "parish_update_failed", {field: "Error en el archivo: parish"}));
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
                throw new HttpError("ID de parroquia requerido.", 400, "missing_parish_id", {field: "id"});
            }

            await ParishController.deleteParish(id);
            res.status(204).send()
        } catch (error) {
            if (error instanceof HttpError) {
                next(error)
            } else {
                next(new HttpError("Error al eliminar la parroquia.", 500, "parish_deletion_failed", {field: "Error en el archivo: parish"}));
            }
        }
    }
)

export default router;