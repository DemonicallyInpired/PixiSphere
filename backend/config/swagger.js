import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pixisphere Marketplace API',
      version: '1.0.0',
      description: 'AI-powered photography service marketplace backend API',
      contact: {
        name: 'Pixisphere Team',
        email: 'api@pixisphere.com',
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://pixisphere-api.herokuapp.com' 
          : `http://localhost:${process.env.PORT || 3000}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['client', 'partner', 'admin'] },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            phone: { type: 'string' },
            city: { type: 'string' },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        PartnerProfile: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            userId: { type: 'integer' },
            businessName: { type: 'string' },
            description: { type: 'string' },
            experience: { type: 'integer' },
            basePrice: { type: 'number' },
            serviceCategories: { type: 'array', items: { type: 'string' } },
            verificationStatus: { type: 'string', enum: ['pending', 'verified', 'rejected'] },
            isFeatured: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Portfolio: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            partnerId: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string' },
            imageUrl: { type: 'string', format: 'uri' },
            category: { type: 'string', enum: ['wedding', 'maternity', 'portrait', 'event', 'commercial', 'fashion'] },
            displayOrder: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Inquiry: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            clientId: { type: 'integer' },
            category: { type: 'string', enum: ['wedding', 'maternity', 'portrait', 'event', 'commercial', 'fashion'] },
            eventDate: { type: 'string', format: 'date-time' },
            budget: { type: 'number' },
            city: { type: 'string' },
            description: { type: 'string' },
            referenceImageUrl: { type: 'string', format: 'uri' },
            status: { type: 'string', enum: ['new', 'responded', 'booked', 'closed'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'object' } },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints',
      },
      {
        name: 'Client',
        description: 'Client-specific endpoints for inquiries and partner browsing',
      },
      {
        name: 'Partner',
        description: 'Partner-specific endpoints for profile, portfolio, and lead management',
      },
      {
        name: 'Admin',
        description: 'Admin endpoints for verification, moderation, and system management',
      },
      {
        name: 'Public',
        description: 'Public endpoints accessible without authentication',
      },
    ],
  },
  apis: ['./routes/*.js'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
