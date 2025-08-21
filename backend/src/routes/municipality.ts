import { NextFunction, Router, Request, Response } from "express";
import { MunicipalityController } from "@/controllers/";
import { requirePermission } from "@/middleware/authorization";
import { Municipality } from "@/models"

import { HttpError } from "@/utils/error-utils";

const router = Router();

router.get(
    "/",
    requirePermission("get_municipality"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string, 10) || 1
              const pageSize = parseInt(req.query.pageSize as string, 10) || 10
              const name = (req.query.name as Municipality['name']) || undefined
              const sortBy = MunicipalityController.SortByOptions.includes(req.query.sortBy as string)
                ? (req.query.sortBy as MunicipalityController.MunicipalityFilterOptions['sortBy'])
                : undefined
              const sortOrder = (req.query.sortOrder as 'ASC' | 'DESC') || 'ASC'

        const municipalities = await MunicipalityController.allMunicipalities({
            page,
            pageSize,
            name,
            sortBy,
            sortOrder,
        });
        res.json(municipalities);
    } catch (error) {
        if (error instanceof HttpError) {
            next(error);
        }else{
            next(new HttpError("Error al obtener municipios", 500, "municipality_fetch_failed", {field: "Error en el archivo: municipality"}));
        }
    }
});

router.get(
    "/:id",
    requirePermission("get_municipality"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const municipalityId = parseInt(req.params.id, 10)

        if(!municipalityId){
            throw new HttpError("ID de municipio requerido.", 400, "missing_municipality_id", {field: "id"});
        }

        const municipality = await MunicipalityController.getById(municipalityId);
        res.json(municipality);
    } catch (error) {
        if (error instanceof HttpError) {
            next(error);
        }else{
            next(new HttpError("Error al obtener municipio", 500, "municipality_fetch_failed", {field: "Error en el archivo: municipality"}));
        }
    }
});

router.post(
    "/",
    requirePermission("create_municipality"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const {name, stateId}= req.body;

            if (!name) {
                throw new HttpError("Nombre de municipio requerido.", 400, "Missing_name", {field: "name"});
            }

            if (!stateId) {
                throw new HttpError("Id de estado requerido.", 400, "Missing_state_id", {field: "stateId"});
            }

            const newMunicipality = await MunicipalityController.createMunicipality(name, stateId);
            res.status(201).json(newMunicipality);
        } catch (error) {
            if (error instanceof HttpError) {
                next(error);
            } else {
                next(new HttpError("Error al crear municipio", 500, "municipality_creation_failed", {field: "Error en el archivo: municipality"}));
            }
        }
    }
);

router.put(
    "/:id",
    requirePermission("edit_municipality"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const updates: Partial<Municipality> = {}
        updates.id = Number(req.params.id);
        if (!updates.id){
            throw new HttpError("ID de municipio requerido", 400, "missing_municipality_id", {field: "id"});
        }

        if (req.body.name !== undefined) updates.name = req.body.name;
        if (req.body.stateId !== undefined) updates.stateId = req.body.stateId

        const updateMunicipality = await MunicipalityController.updateMunicipality(updates);
        res.json(updateMunicipality);
    } catch (error) {
        if (error instanceof HttpError) {
            next(error);
        } else {
            next(new HttpError("Error al actualizar municipio", 500, "municipality_update_failed", {field: "Error en el archivo: municipality"}));
        }
    }
});

router.delete(
    "/:id",
    requirePermission("delete_municipality"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = Number(req.params.id);
        if (!id) {
            throw new HttpError("ID de municipio requerido", 400, "missing_municipality_id", {field: "id"});
        }

        await MunicipalityController.deleteMunicipality(id);
        res.status(204).send()
    } catch (error) {
        if (error instanceof HttpError) {
            next(error);
        } else {
            next(new HttpError("Error al eliminar municipio", 500, "municipality_deletion_failed", {field: "Error en el archivo: municipality"}));
        }
    }
});

export default router;
