import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {

  const statusCode = err.statusCode || 500;
  const message = err.message || "Error interno del servidor";
  const errorType = err.errorType || "InternalError";
  const details = err.details || "No hay detalles adicionales";

  // responde con estado y mensaje al cliente
  res.status(statusCode).json({
    message,
    errorType: err.errorType || "InternalError",
    details: err.details || "No hay detalles adicionales"
  });
}

