import { NextFunction, Router, Request, Response } from "express";
import { ResponsibleController } from "@/controllers/";
import { requirePermission } from "@/middleware/authorization";
import { Responsible } from "@/models"

const router = Router();

router.get(
    "/",
    requirePermission("get_responsible"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string, 10) || 1
              const pageSize = parseInt(req.query.pageSize as string, 10) || 10
              const firstName = (req.query.firstName as Responsible['firstName']) || undefined
              const lastName = (req.query.lastName as Responsible['lastName']) || undefined
              const organismName = (req.query.organismName as string) || undefined
              const sortBy = ResponsibleController.SortByOptions.includes(req.query.sortBy as string)
                ? (req.query.sortBy as ResponsibleController.ResponsibleFilterOptions['sortBy'])
                : undefined
              const sortOrder = (req.query.sortOrder as 'ASC' | 'DESC') || 'ASC'

        const responsible = await ResponsibleController.allRespnsible({
            page,
            pageSize,
            firstName,
            lastName,
            organismName,
            sortBy,
            sortOrder,
        });
        res.json(responsible);
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).json({ message: error.message });
        }else{
            next(error);
        }
    }
});

router.get(
    "/:id",
    requirePermission("get_responsible"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const responsibleId = parseInt(req.params.id, 10)
        const responsible = await ResponsibleController.getById(responsibleId);
        if (!responsible) {
            res.status(404).json({ message: "Responsable no encontrado." });
            return;
        }
        res.json(responsible);
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).json({ message: error.message });
        }else{
            next(error);
        }
    }
});

router.post(
    "/",
    requirePermission("create_responsible"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const {
                firstName,
                lastName,
                ci,
                phone,
                position,
                phoneBackup,
                email,
                organismId,
            }= req.body;
            if (!firstName) {
                res.status(400).json({ message: "Nombre del responsable requerido." });
                return;
            }
            if (!lastName) {
                res.status(400).json({ message: "Apellido del responsable requerido." });
                return;
            }
            if (!ci) {
                res.status(400).json({ message: "CI del responsable requerido." });
                return;
            }
            if (!phone) {
                res.status(400).json({ message: "Telefono del responsable requerido." });
                return;
            }
            if (!position) {
                res.status(400).json({ message: "Cargo del responsable requerido." });
                return;
            }
            const newResponsible = await ResponsibleController.createResponsible(
                // campos obligatorios
                firstName,
                lastName,
                ci,
                phone,
                position,

                //campos opcionales
                phoneBackup,
                email,
                organismId,
            );
            res.status(201).json(newResponsible);
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).json({ message: error.message });
            } else {
                next(error);
            }
        }
    }
);

router.put(
    "/:id",
    requirePermission("edit_responsible"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const updates: Partial<Responsible> = {}
        updates.id = Number(req.params.id);
        if (!updates.id){
            res.status(400).json({ message: "ID de municipio requerido." });
            return;
        }
        if (req.body.firstName !== undefined) updates.firstName = req.body.firstName;
        if (req.body.lastName !== undefined) updates.lastName = req.body.lastName
        if (req.body.ci !== undefined) updates.ci = req.body.ci
        if (req.body.phone !== undefined) updates.phone = req.body.phone
        if (req.body.phoneBackup !== undefined) updates.phoneBackup = req.body.phoneBackup
        if (req.body.email !== undefined) updates.email = req.body.email
        if (req.body.position !== undefined) updates.position = req.body.position
        if (req.body.organismId !== undefined) updates.organismId = req.body.organismId

        const updateResponsible = await ResponsibleController.updateResponsible(updates);
        if (!updateResponsible) {
            res.status(404).json({ message: "Responsable no encontrado." });
            return;
        }
        res.json(updateResponsible);
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).json({ message: error.message });
        } else {
            next(error);
        }
    }
});

router.delete(
    "/:id",
    requirePermission("delete_responsible"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = Number(req.params.id);
        if (!id) {
            res.status(400).json({ message: "ID del responsable requerido." });
            return;
        }

        await ResponsibleController.deleteResponsible(id);
        res.status(204).send()
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).json({ message: error.message });
        } else {
            next(error);
        }
    }
});

export default router;