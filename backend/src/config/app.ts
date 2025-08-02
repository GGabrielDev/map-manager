import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server configuration
  port: parseInt(process.env.PORT || '4000'),
  baseUrl: process.env.BASE_URL || 'localhost',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  nodeEnv: process.env.NODE_ENV || 'development',

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-key',
    expiresIn: process.env.JWT_EXPIRE_TIME || '1h',
  },

  // Database configuration
  database: {
    dialect: process.env.DB_DIALECT || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    name: process.env.DB_NAME || 'geospatial_admin',
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    storage: process.env.DB_STORAGE || ':memory:',
  },

  // Security configuration
  bcrypt: {
    saltRounds: 10,
  },

  // Pagination defaults
  pagination: {
    defaultPage: 1,
    defaultPageSize: 10,
    maxPageSize: 100,
  },

  // Spatial configuration
  spatial: {
    defaultSRID: 4326, // WGS84
    bboxMaxSize: 1000000, // Maximum bounding box size in square meters
  },
};

export default config;
