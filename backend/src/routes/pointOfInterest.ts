import { NextFunction, Request, Response, Router } from "express";
import { PointOfInterestController, ResponsibleController, OrganismController } from "@/controllers/"; // Ajusta la ruta según corresponda
import { requirePermission } from "@/middleware/authorization";
import { PointOfInterest } from "@/models";

const router = Router();

// Listar puntos de interés con paginación y filtros
router.get(
  "/",
  requirePermission("get_pointofinterest"),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
      const name = (req.query.name as string) || undefined;

      const sortBy = PointOfInterestController.SortByOptions.includes(req.query.sortBy as string)
        ? (req.query.sortBy as PointOfInterestController.PointOfInterestFilterOptions["sortBy"])
        : undefined;

      const sortOrder =
        (req.query.sortOrder as "ASC" | "DESC") || "ASC";

      const pointsOfInterest = await PointOfInterestController.allPointsOfInterest({
        page,
        pageSize,
        name,
        sortBy,
        sortOrder,
      });

      res.json(pointsOfInterest);
    } catch (error) {
      next(error);
    }
  }
);

// Obtener punto de interés por ID
router.get(
  "/:id",
  requirePermission("get_pointofinterest"),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        res.status(400).json({ error: "ID inválido" });
        return;
      }

      const point = await PointOfInterestController.getPointOfInterestById(id);

      res.json(point);
    } catch (error) {
      next(error);
    }
  }
);

// Crear nuevo punto de interés
router.post(
  "/",
  requirePermission("create_pointofinterest"),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let {
        //Datos de puntos de interes
        name,
        geometry,
        description,
        responsibleId,
        organismId,
        communalCircuitId,
        quadrantId,

        //datos de responsable en caso de crearlo directamente
        responsibleFirstName,
        responsibleLastName,
        responsibleCi,
        responsiblePhone,
        responsiblePosition,
        responsiblePhoneBackup,
        responsibleEmail,

        //datos de organismo en caso de crearlo directamente
        organismName
      } = req.body;

      

      if (!name || !geometry) {
        res.status(400).json({ error: "Campos obligatorios incompletos" });
        return;
      }

      // Crear responsable en caso de no existir
      if(!responsibleId){
        const responsible = await ResponsibleController.createResponsible(
          responsibleFirstName,
          responsibleLastName,
          responsibleCi,
          responsiblePhone,
          responsiblePosition,
          responsiblePhoneBackup,
          responsibleEmail
        );

        responsibleId = responsible.id;
      }

      // Crear organismo en caso de no existir
      if(!organismId && req.file){
        const fileIcono = req.file;
        const icono = await OrganismController.validateImage(organismName, fileIcono)
        const organism = await OrganismController.createOrganism(organismName, icono);
        
        organismId = organism.id;
      }

      const newPoint = await PointOfInterestController.createPointOfInterest(
        name,
        geometry,
        description,
        responsibleId,
        organismId,
        communalCircuitId,
        quadrantId
      );

      res.status(201).json(newPoint);
    } catch (error) {
      next(error);
    }
  }
);

// Actualizar punto de interés
router.put(
  "/:id",
  requirePermission("update_pointofinterest"),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updates: Partial<PointOfInterest> = {}
      updates.id = Number(req.params.id);
      if (!updates.id) {
        res.status(400).json({ error: "ID inválido" });
        return;
      }

      if (req.body.name !== undefined) updates.name = req.body.name;
      if (req.body.geometry !== undefined) updates.geometry = req.body.geometry;
      if (req.body.description !== undefined) updates.description = req.body.description;
      if (req.body.responsibleId !== undefined) updates.responsibleId = req.body.responsibleId;
      if (req.body.organismId !== undefined) updates.organismId = req.body.organismId;
      if (req.body.communalCircuitId !== undefined) updates.communalCircuitId = req.body.communalCircuitId;
      if (req.body.quadrantId !== undefined) updates.quadrantId = req.body.quadrantId;

      const updatedPoint = await PointOfInterestController.updatePointOfInterest(updates);

      res.json(updatedPoint);
    } catch (error) {
      next(error);
    }
  }
);

// Eliminar punto de interés (soft delete)
router.delete(
  "/:id",
  requirePermission("delete_pointofinterest"),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);

      if (!id) {
        res.status(400).json({ error: "ID del punto de interés requerido" });
        return;
      }

      const deleted = await PointOfInterestController.deletePointOfInterest(id);

      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: "Punto de interés no encontrado" });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;
