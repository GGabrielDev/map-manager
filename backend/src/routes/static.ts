import { NextFunction, Request, Response, Router } from "express";
import path from "path";
import fs from "fs";


const router = Router();
// Ruta para obtener la imagen del organismo
router.get(
  "/organisms/icono/:filename",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filename = req.params.filename;

      // Construir la ruta absoluta al archivo de imagen
      const imagePath = path.join(__dirname, "../../../static/organism", filename);

      // Verificar que el archivo exista
      if (!fs.existsSync(imagePath)) {
        res.status(404).json({ message: "Imagen no encontrada" });
        return;
      }

      // Enviar el archivo de imagen
      res.sendFile(imagePath);
    } catch (error) {
      next(error);
    }
  }
);

export default router;