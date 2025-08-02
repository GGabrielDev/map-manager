// Global type definitions for the geospatial administration system

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  code?: string;
  details?: any;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface SpatialFilterParams {
  bbox?: string; // Format: "minLng,minLat,maxLng,maxLat"
}

export interface GeographicalEntity {
  id: number;
  name: string;
  creationDate: Date;
  updatedOn: Date;
  deletionDate?: Date;
}

export interface SpatialEntity extends GeographicalEntity {
  boundary: any; // GeoJSON geometry
  metadata?: Record<string, any>;
}

export interface Coordinates {
  coordinate_x: number; // longitude
  coordinate_y: number; // latitude
}

// Database Models Interfaces
export interface IUser extends GeographicalEntity {
  username: string;
  passwordHash: string;
}

export interface IRole extends GeographicalEntity {
  description?: string;
}

export interface IPermission {
  id: number;
  name: string;
  description: string;
  deletionDate?: Date;
}

export interface IState extends GeographicalEntity {}

export interface IMunicipality extends GeographicalEntity {
  state_id: number;
}

export interface IParish extends GeographicalEntity {
  municipality_id: number;
}

export interface IQuadrant extends SpatialEntity {
  parish_id: number;
}

export interface ICommunalCircuit extends SpatialEntity {
  parish_id: number;
}

export interface IPointOfInterest extends GeographicalEntity, Coordinates {
  description?: string;
  circuit_communal_id?: number;
  quadrant_id?: number;
  organism_id?: number;
}

export interface IOrganism extends GeographicalEntity {}

export interface IResponsible extends GeographicalEntity {
  phone: string;
  position: string;
  organism_id: number;
}

// JWT Payload
export interface JWTPayload {
  userId: number;
  username: string;
  roles: string[];
  permissions: string[];
  iat?: number;
  exp?: number;
}

// Request extensions
declare global {
  namespace Express {
    interface Request {
      userId?: number;
      user?: IUser;
    }
  }
}
