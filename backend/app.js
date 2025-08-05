import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';
import { generalLimiter } from './middlewares/rateLimiter.js';
import { specs, swaggerUi } from './config/swagger.js';
import logger from './utils/logger.js';
import uploadRoutes from './routes/upload.js';

// Import routes
import authRoutes from './routes/auth.js';
import clientRoutes from './routes/client.js';
import partnerRoutes from './routes/partner.js';
import adminRoutes from './routes/admin.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://pixisphere.com', 'https://www.pixisphere.com']
    : ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Request parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// Rate limiting
app.use(generalLimiter);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    
    res.json({
      success: true,
      message: 'Pixisphere API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: dbConnected ? 'connected' : 'disconnected',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Pixisphere API is running but database connection failed',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: 'error',
      error: error.message,
    });
  }
});

// API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Pixisphere API Documentation',
}));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api', clientRoutes);
app.use('/api/partner', partnerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Pixisphere Marketplace API',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      auth: '/api/auth',
      client: '/api',
      partner: '/api/partner',
      admin: '/api/admin',
    },
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// Global error handler
app.use((error, req, res, next) => {
  logger.error('Global error handler:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(isDevelopment && { 
      stack: error.stack,
      details: error.details 
    }),
  });
});

// Graceful shutdown handler
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });

  // Force close after 30 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
};

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      logger.warn('⚠️  Database connection failed. Server will start but some features may not work.');
      logger.warn('⚠️  Please check your DATABASE_URL environment variable and database connectivity.');
    } else {
      logger.info('✅ Database connection successful');
    }

    // Start HTTP server
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Pixisphere API server running on port ${PORT}`);
      logger.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      logger.info(`🏥 Health Check: http://localhost:${PORT}/health`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV}`);
      if (!dbConnected) {
        logger.warn('⚠️  Server running in limited mode due to database connection issues');
      }
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    return server;
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}

export default app;
