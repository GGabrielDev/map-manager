import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@/config/app';
import { JWTPayload } from '@/types';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      error: 'Access token required',
      code: 'UNAUTHORIZED',
      details: {
        message: 'Please provide a valid JWT token in the Authorization header'
      }
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
    req.userId = decoded.userId;
    req.user = {
      id: decoded.userId,
      username: decoded.username,
      // Add other user properties as needed
    } as any;
    next();
  } catch (error) {
    res.status(403).json({
      error: 'Invalid or expired token',
      code: 'FORBIDDEN',
      details: {
        message: 'The provided token is invalid or has expired'
      }
    });
  }
};

export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // This will be implemented when we have the user/role/permission system
    // For now, just pass through if authenticated
    if (!req.userId) {
      res.status(401).json({
        error: 'Authentication required',
        code: 'UNAUTHORIZED'
      });
      return;
    }
    
    // TODO: Check if user has the required permission
    // const userPermissions = req.user?.permissions || [];
    // if (!userPermissions.includes(permission)) {
    //   return res.status(403).json({
    //     error: 'Insufficient permissions',
    //     code: 'FORBIDDEN',
    //     details: { requiredPermission: permission }
    //   });
    // }
    
    next();
  };
};

export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // This will be implemented when we have the user/role system
    if (!req.userId) {
      res.status(401).json({
        error: 'Authentication required',
        code: 'UNAUTHORIZED'
      });
      return;
    }
    
    // TODO: Check if user has the required role
    // const userRoles = req.user?.roles || [];
    // if (!userRoles.includes(role)) {
    //   return res.status(403).json({
    //     error: 'Insufficient role',
    //     code: 'FORBIDDEN',
    //     details: { requiredRole: role }
    //   });
    // }
    
    next();
  };
};
