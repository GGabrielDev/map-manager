import { NextFunction, Router, Request, Response } from "express";
import { ParishController } from "@/controllers";
import { requirePermission } from "@/middleware/authorization";
import { Parish } from "@/models";

const router = Router();

router.get(
    "/",
    requirePermission("get_Parish"),
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