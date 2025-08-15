import { NextFunction, Router, Request, Response } from "express";
import { QuadrantController } from "@/controllers/";
import { requirePermission } from "@/middleware/authorization";
import { Quadrant } from "@/models"

const router = Router();

router.get(
    "/",
    requirePermission("get_quadrant"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string, 10) || 1
              const pageSize = parseInt(req.query.pageSize as string, 10) || 10
              const name = (req.query.name as Quadrant['name']) || undefined
              const sortBy = QuadrantController.SortByOptions.includes(req.query.sortBy as string)
                ? (req.query.sortBy as QuadrantController.QuadrantFilterOptions['sortBy'])
                : undefined
              const sortOrder = (req.query.sortOrder as 'ASC' | 'DESC') || 'ASC'

        const quadrant = await QuadrantController.allQuadrant({
            page,
            pageSize,
            name,
            sortBy,
            sortOrder,
        });
        res.json(quadrant);
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).json({ message: error.message });
        }else{
            next(error);
        }
    }
});

router.get(
    "/geojson",
    requirePermission("get_quadrant"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
              const name = (req.query.name as Quadrant['name']) || undefined
              const sortBy = QuadrantController.SortByOptions.includes(req.query.sortBy as string)
                ? (req.query.sortBy as QuadrantController.QuadrantFilterOptions['sortBy'])
                : undefined
              const sortOrder = (req.query.sortOrder as 'ASC' | 'DESC') || 'ASC'

        const quadrantGeoJson = await QuadrantController.allQuadrantsGeoJSON({
            name,
            sortBy,
            sortOrder,
        });
        res.json(quadrantGeoJson);
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
    requirePermission("get_quadrant"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const quadrantId = parseInt(req.params.id, 10)
        const quadrant = await QuadrantController.getById(quadrantId);
        if (!quadrant) {
            res.status(404).json({ message: "Cuadrante no encontrado." });
            return;
        }
        res.json(quadrant);
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).json({ message: error.message });
        }else{
            next(error);
        }
    }
});

router.get(
    "/:id/geojson",
    requirePermission("get_quadrant"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const quadrantId = parseInt(req.params.id, 10)
        const quadrant = await QuadrantController.getByIdGeoJson(quadrantId);
        if (!quadrant) {
            res.status(404).json({ message: "Cuadrante no encontrado." });
            return;
        }
        res.json(quadrant);
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
    requirePermission("create_quadrant"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const {
                name,
                parishId,
                organismId,
                boundary,
                fleet,
                metadata
            }= req.body;
            
            if (!name) {
                res.status(400).json({ message: "Nombre de municipio requerido." });
                return;
            }
            if (!parishId) {
                res.status(400).json({ message: "Id de la parroquia requerido." });
                return;
            }
            if (!organismId) {
                res.status(400).json({ message: "Id del organismo requerido." });
                return;
            }
            if (!boundary) {
                res.status(400).json({ message: "Limite requerido." });
                return;
            }
            if (!fleet) {
                res.status(400).json({ message: "Flota requerido." });
                return;
            }

            const newQuadrant = await QuadrantController.createQuadrant(
                name,
                parishId,
                organismId,
                boundary,
                fleet,
                metadata
            );
            res.status(201).json(newQuadrant);
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
    requirePermission("edit_quadrant"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const updates: Partial<Quadrant> = {}
        updates.id = Number(req.params.id);
        if (!updates.id){
            res.status(400).json({ message: "ID del cuadrante requerido." });
            return;
        }
        if (req.body.name !== undefined) updates.name = req.body.name;
        if (req.body.parishId !== undefined) updates.parishId = req.body.parishId
        if (req.body.organismId !== undefined) updates.organismId = req.body.organismId
        if (req.body.boundary !== undefined) updates.boundary = req.body.boundary
        if (req.body.fleet !== undefined) updates.fleet = req.body.fleet
        if (req.body.metadata !== undefined) updates.metadata = req.body.metadata

        const updateQuadrant = await QuadrantController.updateQuadrant(updates);
        if (!updateQuadrant) {
            res.status(404).json({ message: "Cuadrante no encontrado." });
            return;
        }
        res.json(updateQuadrant);
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
    requirePermission("delete_quadrant"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = Number(req.params.id);
        if (!id) {
            res.status(400).json({ message: "ID del cuadrante requerido." });
            return;
        }

        await QuadrantController.deleteQuadrant(id);
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