import { Request } from 'express';
import { PaginationParams, SpatialFilterParams } from '@/types';
import { config } from '@/config/app';
import { createValidationError } from '@/middleware/errorHandler';

export const validatePagination = (req: Request): PaginationParams => {
  const page = parseInt(req.query.page as string) || config.pagination.defaultPage;
  const pageSize = parseInt(req.query.pageSize as string) || config.pagination.defaultPageSize;
  const sortBy = req.query.sortBy as string;
  const sortOrder = (req.query.sortOrder as string)?.toUpperCase() as 'ASC' | 'DESC' || 'ASC';

  if (page < 1) {
    throw createValidationError('Page must be greater than 0');
  }

  if (pageSize < 1 || pageSize > config.pagination.maxPageSize) {
    throw createValidationError(`Page size must be between 1 and ${config.pagination.maxPageSize}`);
  }

  if (sortOrder && !['ASC', 'DESC'].includes(sortOrder)) {
    throw createValidationError('Sort order must be ASC or DESC');
  }

  return {
    page,
    pageSize,
    sortBy,
    sortOrder
  };
};

export const validateSpatialFilter = (req: Request): SpatialFilterParams => {
  const bbox = req.query.bbox as string;
  
  if (bbox) {
    const coords = bbox.split(',').map(Number);
    
    if (coords.length !== 4) {
      throw createValidationError('Bounding box must have 4 coordinates: minLng,minLat,maxLng,maxLat');
    }

    const [minLng, minLat, maxLng, maxLat] = coords;

    if (coords.some(isNaN)) {
      throw createValidationError('All bounding box coordinates must be valid numbers');
    }

    if (minLng >= maxLng || minLat >= maxLat) {
      throw createValidationError('Invalid bounding box: min values must be less than max values');
    }

    if (minLng < -180 || maxLng > 180 || minLat < -90 || maxLat > 90) {
      throw createValidationError('Bounding box coordinates must be within valid geographic bounds');
    }
  }

  return { bbox };
};

export const validateCoordinates = (coordinate_x: number, coordinate_y: number): void => {
  if (typeof coordinate_x !== 'number' || typeof coordinate_y !== 'number') {
    throw createValidationError('Coordinates must be valid numbers');
  }

  if (coordinate_x < -180 || coordinate_x > 180) {
    throw createValidationError('Longitude must be between -180 and 180');
  }

  if (coordinate_y < -90 || coordinate_y > 90) {
    throw createValidationError('Latitude must be between -90 and 90');
  }
};

export const validateGeoJSON = (geometry: any): void => {
  if (!geometry || typeof geometry !== 'object') {
    throw createValidationError('Geometry must be a valid GeoJSON object');
  }

  if (!geometry.type || !geometry.coordinates) {
    throw createValidationError('GeoJSON geometry must have type and coordinates properties');
  }

  const validTypes = ['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon'];
  if (!validTypes.includes(geometry.type)) {
    throw createValidationError(`Invalid geometry type. Must be one of: ${validTypes.join(', ')}`);
  }

  if (!Array.isArray(geometry.coordinates)) {
    throw createValidationError('GeoJSON coordinates must be an array');
  }
};

export const sanitizeString = (str: string, maxLength: number = 255): string => {
  if (typeof str !== 'string') {
    throw createValidationError('Value must be a string');
  }

  const sanitized = str.trim();
  
  if (sanitized.length === 0) {
    throw createValidationError('String cannot be empty');
  }

  if (sanitized.length > maxLength) {
    throw createValidationError(`String cannot be longer than ${maxLength} characters`);
  }

  return sanitized;
};

export const validateId = (id: string | number): number => {
  const numId = typeof id === 'string' ? parseInt(id) : id;
  
  if (isNaN(numId) || numId < 1) {
    throw createValidationError('ID must be a positive integer');
  }

  return numId;
};

export const validateVenezuelanPhone = (phone: string): string => {
  if (typeof phone !== 'string') {
    throw createValidationError('Phone number must be a string');
  }

  const cleanPhone = phone.trim();
  
  if (cleanPhone.length === 0) {
    throw createValidationError('Phone number cannot be empty');
  }

  // Venezuelan phone number patterns
  const landlinePattern = /^(\+58|0058|58)?[24]\d{9}$/;
  const mobilePattern = /^(\+58|0058|58)?4\d{9}$/;
  
  if (!landlinePattern.test(cleanPhone) && !mobilePattern.test(cleanPhone)) {
    throw createValidationError(
      'Phone number must be a valid Venezuelan format. ' +
      'Landlines: (+58|0058|58)[24]XXXXXXXXX, Mobile: (+58|0058|58)4XXXXXXXXX'
    );
  }

  return cleanPhone;
};

export const validatePosition = (position: string): string => {
  return sanitizeString(position, 100);
};
