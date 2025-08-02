import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Geospatial Administration System Backend is running',
    timestamp: new Date().toISOString()
  });
});

// API routes placeholder
app.use('/api', (req, res) => {
  res.json({ 
    message: 'API routes will be implemented here',
    availableEndpoints: [
      '/api/auth',
      '/api/users',
      '/api/roles',
      '/api/permissions',
      '/api/states',
      '/api/municipalities',
      '/api/parishes',
      '/api/quadrants',
      '/api/communal-circuits',
      '/api/points-of-interest',
      '/api/organisms',
      '/api/responsibles'
    ]
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    code: 'INTERNAL_ERROR',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    code: 'NOT_FOUND',
    details: {
      path: req.originalUrl,
      method: req.method
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🗺️  API base: http://localhost:${PORT}/api`);
});

export default app;
