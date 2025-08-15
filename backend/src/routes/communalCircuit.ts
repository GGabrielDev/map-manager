import { NextFunction, Request, Response, Router } from "express";
import { CommunalCircuitController } from "@/controllers";
import { requirePermission } from "@/middleware/authorization";
import { CommunalCircuit } from "@/models";

const router = Router();

router.get(
    "/",
    requirePermission("get_communalcircuit"),
    async(req: Request, res: Response, nex: NextFunction): Promise<void> =>{
        try {
            const page = parseInt(req.query.page as string, 10) || 1
                const pageSize = parseInt(req.query.pageSize as string, 10) || 10
                const name = (req.query.name as CommunalCircuit['name']) || undefined
                const sortBy = CommunalCircuitController.SortByOptions.includes(req.query.sortBy as string)
                    ? (req.query.sortBy as CommunalCircuitController.CommunalCircuitFilterOptions['sortBy'])
                    : undefined
                const sortOrder = (req.query.sortOrder as 'ASC' | 'DESC') || 'ASC'
            
                const quadrant = await CommunalCircuitController.allCommunalCircuits({
                    page,
                    pageSize,
                    name,
                    sortBy,
                    sortOrder,
                });
                res.json(quadrant);
        } catch (error) {
            
        }
    }
);

export default router;