import { NextFunction, Request, Response, Router } from "express";
import { CommunalCircuitController } from "@/controllers";
import { requirePermission } from "@/middleware/authorization";
import { CommunalCircuit } from "@/models";

const router = Router();

router.get(
    "/",
    requirePermission("get_communalcircuit"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string, 10) || 1;
            const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
            const name = (req.query.name as CommunalCircuit['name']) || undefined;
            const parishName = (req.query.parishName as string) || undefined;
            const sortBy = CommunalCircuitController.SortByOptions.includes(req.query.sortBy as string)
                ? (req.query.sortBy as CommunalCircuitController.CommunalCircuitFilterOptions['sortBy'])
                : undefined;
            const sortOrder = (req.query.sortOrder as 'ASC' | 'DESC') || 'ASC';

            const quadrant = await CommunalCircuitController.allCommunalCircuits({
                page,
                pageSize,
                name,
                parishName,
                sortBy,
                sortOrder,
            });
            res.json(quadrant);
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    "/geojson",
    requirePermission("get_communalcircuit"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const name = (req.query.name as CommunalCircuit['name']) || undefined;
            const parishName = (req.query.parishName as string) || undefined;
            const sortBy = CommunalCircuitController.SortByOptions.includes(req.query.sortBy as string)
                ? (req.query.sortBy as CommunalCircuitController.CommunalCircuitFilterOptions['sortBy'])
                : undefined;
            const sortOrder = (req.query.sortOrder as 'ASC' | 'DESC') || 'ASC';

            const geojson = await CommunalCircuitController.allCommunalCircuitsGeoJSON({
                name,
                parishName,
                sortBy,
                sortOrder,
            });
            res.json(geojson);
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    "/:id",
    requirePermission("get_communalcircuit"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({ message: "ID de circuito comunal inválido." });
                return;
            }
            const circuit = await CommunalCircuitController.getById(id);
            if (!circuit) {
                res.status(404).json({ message: "Circuito comunal no encontrado." });
                return;
            }
            res.json(circuit);
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    "/:id/geojson",
    requirePermission("get_communalcircuit"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({ message: "ID de circuito comunal inválido." });
                return;
            }
            const circuitGeoJson = await CommunalCircuitController.getByIdGeoJson(id);
            if (!circuitGeoJson) {
                res.status(404).json({ message: "Circuito comunal no encontrado." });
                return;
            }
            res.json(circuitGeoJson);
        } catch (error) {
            next(error);
        }
    }
);

router.post(
    "/",
    requirePermission("create_communalcircuit"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { name, parishId, addres, code, boundary, metadata } = req.body;
            if (!name) {
                res.status(400).json({ message: "Nombre del circuito comunal requerido." });
                return;
            }
            if (!parishId) {
                res.status(400).json({ message: "ID de la parroquia requerido." });
                return;
            }
            if (!addres) {
                res.status(400).json({ message: "Dirección requerida." });
                return;
            }
            if (!code) {
                res.status(400).json({ message: "Código requerido." });
                return;
            }
            if (!boundary) {
                res.status(400).json({ message: "Límite geográfico (boundary) requerido." });
                return;
            }

            const newCircuit = await CommunalCircuitController.createQuadrant(name, parishId, addres, code, boundary, metadata);
            res.status(201).json(newCircuit);
        } catch (error) {
            next(error);
        }
    }
);

router.put(
    "/:id",
    requirePermission("edit_communalcircuit"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const updates: Partial<CommunalCircuit> = { id: Number(req.params.id) };
            if (!updates.id) {
                res.status(400).json({ message: "ID de circuito comunal requerido e inválido." });
                return;
            }

            if (req.body.name !== undefined) updates.name = req.body.name;
            if (req.body.parishId !== undefined) updates.parishId = req.body.parishId;
            if (req.body.addres !== undefined) updates.addres = req.body.addres;
            if (req.body.code !== undefined) updates.code = req.body.code;
            if (req.body.boundary !== undefined) updates.boundary = req.body.boundary;
            if (req.body.metadata !== undefined) updates.metadata = req.body.metadata;

            const updatedCircuit = await CommunalCircuitController.updateComunalCircuit(updates);
            if (!updatedCircuit) {
                res.status(404).json({ message: "Circuito comunal no encontrado." });
                return;
            }
            res.json(updatedCircuit);
        } catch (error) {
            next(error);
        }
    }
);

router.delete(
    "/:id",
    requirePermission("delete_communalcircuit"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = Number(req.params.id);
            if (!id) {
                res.status(400).json({ message: "ID de circuito comunal requerido." });
                return;
            }
            const deleted = await CommunalCircuitController.deleteCommunalCircuit(id);
            if (!deleted) {
                res.status(404).json({ message: "Circuito comunal no encontrado." });
                return;
            }
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
);

export default router;
