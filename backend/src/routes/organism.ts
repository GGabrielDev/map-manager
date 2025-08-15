import { NextFunction, Router, Request, Response } from "express";
import { OrganismController } from "@/controllers/";
import { requirePermission } from "@/middleware/authorization";
import { Organism } from "@/models"
import multer from "multer";

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
        if (error instanceof Error) {
            res.status(401).json({ message: error.message });
        }else{
            next(error);
        }
    }
});

router.get(
    "/:id",
    requirePermission("get_organism"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const organismId = parseInt(req.params.id, 10)
        const organism = await OrganismController.getById(organismId);
        if (!organism) {
            res.status(404).json({ message: "Organism no encontrado." });
            return;
        }
        res.json(organism);
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
    requirePermission("create_organism"),
    upload.single("icono"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.body.name) {
                res.status(400).json({ message: "Nombre de organismo requerido." });
                return;
            }
            const name = req.body.name

            if (!req.file) {
                res.status(400).json({ message: "Icono de organismo requerido." });
                return;
            }
            const file = req.file;

            const icono = await OrganismController.validateImage(name, file);

            //const icono = `src/img/organism/${newFileName}`;
            const newOrganism = await OrganismController.createOrganism(name, icono);
            res.status(201).json(newOrganism);
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).json({ message: error.message });
            } else {
                next(error);
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
            res.status(400).json({ message: "ID de organismo requerido." });
            return;
        }
        if (req.body.name !== undefined) updates.name = req.body.name;
        if (req.file !== undefined){
            const file = req.file
            const name = req.body.name
            const icono = await OrganismController.validateImage(name, file);
            updates.icono = icono;
        }

        const updatedOrganism = await OrganismController.updateOrganism(updates);
        if (!updatedOrganism) {
            res.status(404).json({ message: "Organismo no encontrado." });
            return;
        }
        res.json(updatedOrganism);
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
    requirePermission("delete_organism"),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = Number(req.params.id);
        if (!id) {
            res.status(400).json({ message: "ID de organismo requerido." });
            return;
        }

        await OrganismController.deleteOrganism(id);
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