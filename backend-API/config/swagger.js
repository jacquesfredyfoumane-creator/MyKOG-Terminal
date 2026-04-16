const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MyKOG API',
      version: '1.0.0',
      description: 'API pour l\'application spirituelle de streaming MyKOG',
      contact: {
        name: 'MyKOG Team',
      },
    },
      servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de developpement',
      },
      {
        url: 'https://mykog-api.onrender.com',
        description: 'Serveur de production',
      },
    ],
    components: {
      schemas: {
        Enseignement: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            preacher: { type: 'string' },
            audioUrl: { type: 'string' },
            imageUrl: { type: 'string' },
            duration: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Annonce: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            content: { type: 'string' },
            imageUrl: { type: 'string' },
            published: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        LiveStream: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            streamUrl: { type: 'string' },
            thumbnailUrl: { type: 'string' },
            status: { type: 'string', enum: ['scheduled', 'live', 'ended'] },
            scheduledAt: { type: 'string', format: 'date-time' },
            viewerCount: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        CalendarEvent: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
            type: { type: 'string', enum: ['culte', 'priere', 'evenement', 'autre'] },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] },
            fcmToken: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Notification: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            body: { type: 'string' },
            data: { type: 'object' },
            sentAt: { type: 'string', format: 'date-time' },
          },
        },
        TextResume: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            summary: { type: 'string' },
            pdfUrl: { type: 'string' },
            fileSize: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            details: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js', './server.js'],
};

module.exports = swaggerJsdoc(options);
