import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err); // log del error sin detener nada

  const statusCode = err.statusCode || 500;
  const message = err.message || "Error interno del servidor";
  const errorType = err.errorType || "InternalError";
  const origin = err.origin || "Unknown";

  // responde con estado y mensaje al cliente
  res.status(statusCode).json({
    message,
    errorType: err.errorType || "InternalError",
    origin: err.origin || "Unknown",
  });

  // no llamar a next() para indicar fin del manejo
}

