import { NextFunction, Router, Request, Response } from "express";
import { OrganismController } from "@/controllers/";
import { requirePermission } from "@/middleware/authorization";
import { Organism } from "@/models"
import multer from "multer";

import { HttpError } from "@/utils/error-utils";

const upload = multer({ dest: "temp/" });

const router = Router();

router.get(
    "/",
    requirePermission("get_organism"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string, 10) || 1
              const pageSize = parseInt(req.query.pageSize as string, 10) || 10
              const name = (req.query.name as Organism['name']) || undefined
              const sortBy = OrganismController.SortByOptions.includes(req.query.sortBy as string)
                ? (req.query.sortBy as OrganismController.OrganismFilterOptions['sortBy'])
                : undefined
              const sortOrder = (req.query.sortOrder as 'ASC' | 'DESC') || 'ASC'
        


        const organism = await OrganismController.allOrganism({
            page,
            pageSize,
            name,
            sortBy,
            sortOrder,
        });
        res.json(organism);
    } catch (error) {
        if (error instanceof HttpError) {
            next(error);
        }else{
            next(new HttpError("Error al obtener los organismos, intente nuevamente.", 500, "organism_fetch_failed", {field: "Error en el archivo: organism"}));
        }
    }
});

router.get(
    "/:id",
    requirePermission("get_organism"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const organismId = parseInt(req.params.id, 10)
        if(!organismId){
            throw new HttpError("ID de organismo requerido", 400, "missing_organism_id", {field: "id"});
        }

        const organism = await OrganismController.getById(organismId);
        if (!organism) {
            throw new HttpError("Organismo no encontrado", 404, "organism_not_found", {field: "id"});
        }
        res.json(organism);
    } catch (error) {
        if (error instanceof HttpError) {
            next(error);
        }else{
            next(new HttpError("Error al obtener el organismo, intente nuevamente.", 500, "organism_fetch_failed", {field: "Error en el archivo: organism"}));
        }
    }
});

router.post(
    "/",
    requirePermission("create_organism"),
    upload.single("icono"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.body.name) {
                throw new HttpError("Nombre de organismo requerido", 400, "missing_organism_name", {field: "name"});
            }
            const name = req.body.name

            if (!req.file) {
                throw new HttpError("Archivo de icono requerido", 400, "missing_organism_icon", {field: "icono"});
            }
            const file = req.file;

            const icono = await OrganismController.validateImage(name, file);

            if (!icono) {
                throw new HttpError("Error al validar el icono", 400, "invalid_organism_icon", {field: "icono"});
            }

            const newOrganism = await OrganismController.createOrganism(name, icono);
            res.status(201).json(newOrganism);
        } catch (error) {
            if (error instanceof HttpError) {
                next(error);
            } else {
                next(new HttpError("Error al crear el organismo, intente nuevamente.", 500, "organism_creation_failed", {field: "Error en el archivo: organism"}));
            }
        }
    }
)

router.put(
    "/:id",
    requirePermission("edit_organism"),
    upload.single("icono"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const updates: Partial<Organism> = {}
        updates.id = Number(req.params.id);
        if (!updates.id){
            throw new HttpError("ID de organismo requerido", 400, "missing_organism_id", {field: "id"});
        }
        if (req.body.name !== undefined) updates.name = req.body.name;
        if (req.file !== undefined){
            const file = req.file
            const name = req.body.name
            const icono = await OrganismController.validateImage(name, file);

            if (!icono) {
                throw new HttpError("Error al validar el icono", 400, "invalid_organism_icon", {field: "icono"});
            }

            updates.icono = icono;
        }

        const updatedOrganism = await OrganismController.updateOrganism(updates);
        res.json(updatedOrganism);
    } catch (error) {
        if (error instanceof HttpError) {
            next(error);
        } else {
            next(new HttpError("Error al actualizar el organismo, intente nuevamente.", 500, "organism_update_failed", {field: "Error en el archivo: organism"}));
        }
    }
});

router.delete(
    "/:id",
    requirePermission("delete_organism"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = Number(req.params.id);
        if (!id) {
            throw new HttpError("ID de organismo requerido", 400, "missing_organism_id", {field: "id"});
        }

        await OrganismController.deleteOrganism(id);
        res.status(204).send()
    } catch (error) {
        if (error instanceof HttpError) {
            next(error);
        } else {
            next(new HttpError("Error al eliminar el organismo, intente nuevamente.", 500, "organism_deletion_failed", {field: "Error en el archivo: organism"}));
        }
    }
});

export default router;