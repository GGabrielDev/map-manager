import { Request, Response, NextFunction } from 'express';
import { config } from '@/config/app';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    code,
    details: config.nodeEnv === 'development' ? {
      stack: err.stack,
      details: err.details
    } : err.details
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'Route not found',
    code: 'NOT_FOUND',
    details: {
      path: req.originalUrl,
      method: req.method
    }
  });
};

export const createError = (
  message: string,
  statusCode: number = 500,
  code: string = 'INTERNAL_ERROR',
  details?: any
): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.code = code;
  error.details = details;
  return error;
};

// Common error creators
export const createValidationError = (message: string, details?: any): AppError => {
  return createError(message, 400, 'VALIDATION_ERROR', details);
};

export const createNotFoundError = (resource: string): AppError => {
  return createError(`${resource} not found`, 404, 'NOT_FOUND');
};

export const createUnauthorizedError = (message: string = 'Unauthorized'): AppError => {
  return createError(message, 401, 'UNAUTHORIZED');
};

export const createForbiddenError = (message: string = 'Forbidden'): AppError => {
  return createError(message, 403, 'FORBIDDEN');
};
