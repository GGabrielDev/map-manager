import { NextFunction, Router, Request, Response } from "express";
import { StateController } from "@/controllers/";
import { requirePermission } from "@/middleware/authorization";
import { State } from "@/models"

const router = Router();

router.get(
    "/",
    requirePermission("get_state"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string, 10) || 1
              const pageSize = parseInt(req.query.pageSize as string, 10) || 10
              const name = (req.query.name as State['name']) || undefined
              const sortBy = StateController.SortByOptions.includes(req.query.sortBy as string)
                ? (req.query.sortBy as StateController.StateFilterOptions['sortBy'])
                : undefined
              const sortOrder = (req.query.sortOrder as 'ASC' | 'DESC') || 'ASC'
        


        const states = await StateController.allStates({
            page,
            pageSize,
            name,
            sortBy,
            sortOrder,
        });
        res.json(states);
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
    requirePermission("get_state"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const stateId = parseInt(req.params.id, 10)
        const state = await StateController.getById(stateId);
        if (!state) {
            res.status(404).json({ message: "Estado no encontrado." });
            return;
        }
        res.json(state);
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
    requirePermission("create_state"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.body.name) {
            res.status(400).json({ message: "Nombre de estado requerido." });
            return;
        }
        const newState = await StateController.createState(req.body.name);
        res.status(201).json(newState);
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).json({ message: error.message });
        } else {
            next(error);
        }
    }
});

router.put(
    "/:id",
    requirePermission("edit_state"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const updates: Partial<State> = {}
        updates.id = Number(req.params.id);
        if (!updates.id){
            res.status(400).json({ message: "ID de estado requerido." });
            return;
        }
        if (req.body.name !== undefined) updates.name = req.body.name;

        const updatedState = await StateController.updateState(updates);
        if (!updatedState) {
            res.status(404).json({ message: "Estado no encontrado." });
            return;
        }
        res.json(updatedState);
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
    requirePermission("delete_state"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = Number(req.params.id);
        if (!id) {
            res.status(400).json({ message: "ID de estado requerido." });
            return;
        }

        await StateController.deleteState(id);
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