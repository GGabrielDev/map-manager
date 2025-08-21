import { NextFunction, Request, Response, Router } from "express";
import { CommunalCircuitController } from "@/controllers";
import { requirePermission } from "@/middleware/authorization";
import { CommunalCircuit } from "@/models";

import { HttpError } from "@/utils/error-utils";

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
            next(new HttpError("Error al obtener los circuitos comunales.", 500, "get_communalcircuit_failed", {field: "Error en el archivo: communalCircuit"}));
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
            next(new HttpError("Error al obtener los circuitos comunales en formato GeoJSON.", 500, "get_communalcircuit_geojson_failed", {field: "Error en el archivo: communalCircuit"}));
        }
    }
);

router.get(
    "/:id",
    requirePermission("get_communalcircuit"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = parseInt(req.params.id, 10);
            if (!id) {
                throw new HttpError("ID de circuito comunal requerido", 400, "Missing_id", {field: "id"});
            }
            const circuit = await CommunalCircuitController.getById(id);
            res.json(circuit);
        } catch (error) {
            if(error instanceof HttpError) {
                next(error);
            }else{
                next(new HttpError("Error al obtener el circuito comunal", 500, "get_communalcircuit_by_id_failed", {field: "Error en el archivo: communalCircuit"}));
            }
        }
    }
);

router.get(
    "/:id/geojson",
    requirePermission("get_communalcircuit"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = parseInt(req.params.id, 10);
            if (!id) {
                throw new HttpError("ID del circuito comunal requerido", 400, "Missing_id", {field: "id"});
            }
            const circuitGeoJson = await CommunalCircuitController.getByIdGeoJson(id);
            res.json(circuitGeoJson);
        } catch (error) {
            if (error instanceof HttpError) {
                next(error);
            } else {
                next(new HttpError("Error al obtener el circuito comunal en formato GeoJSON.", 500, "get_communalcircuit_geojson_failed", {field: "Error en el archivo: communalCircuit"}));
            }
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
                throw new HttpError("Nombre del circuito comunal requerido.", 400, "Missing_name", {field: "name"});
            }
            if (!parishId) {
                throw new HttpError("ID de la parroquia requerido.", 400, "Missing_parishId", {field: "parishId"});
            }
            if (!addres) {
                throw new HttpError("Dirección requerida.", 400, "Missing_address", {field: "address"});
            }
            if (!code) {
                throw new HttpError("Código requerido.", 400, "Missing_code", {field: "code"});
            }
            if (!boundary) {
                throw new HttpError("Límite geográfico (boundary) requerido.", 400, "Missing_boundary", {field: "boundary"});
            }

            const newCircuit = await CommunalCircuitController.createQuadrant(name, parishId, addres, code, boundary, metadata);
            res.status(201).json(newCircuit);
        } catch (error) {
            if (error instanceof HttpError) {
                next(error);
            } else {
                next(new HttpError("Error al crear el circuito comunal.", 500, "create_communalcircuit_failed", {field: "Error en el archivo: communalCircuit"}));
            }
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
                throw new HttpError("ID de circuito comunal requerido.", 400, "Missing_id", {field: "id"});
            }

            if (req.body.name !== undefined) updates.name = req.body.name;
            if (req.body.parishId !== undefined) updates.parishId = req.body.parishId;
            if (req.body.addres !== undefined) updates.addres = req.body.addres;
            if (req.body.code !== undefined) updates.code = req.body.code;
            if (req.body.boundary !== undefined) updates.boundary = req.body.boundary;
            if (req.body.metadata !== undefined) updates.metadata = req.body.metadata;

            const updatedCircuit = await CommunalCircuitController.updateComunalCircuit(updates);
            res.json(updatedCircuit);
        } catch (error) {
            if (error instanceof HttpError) {
                next(error);
            } else {
                next(new HttpError("Error al actualizar el circuito comunal.", 500, "update_communalcircuit_failed", {field: "Error en el archivo: communalCircuit"}));
            }
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
                throw new HttpError("ID de circuito comunal requerido.", 400, "Missing_id", {field: "id"});
            }
            const deleted = await CommunalCircuitController.deleteCommunalCircuit(id);
            res.status(204).send();
        } catch (error) {
            if (error instanceof HttpError) {
                next(error);
            } else {
                next(new HttpError("Error al eliminar el circuito comunal.", 500, "delete_communalcircuit_failed", {field: "Error en el archivo: communalCircuit"}));
            }
        }
    }
);

export default router;
