import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'School API',
      version: '1.0.0',
      description: 'API for managing students, courses, and teachers',
    },
    tags: [
      { name: 'Auth', description: 'Authentication routes (register, login)' },
      { name: 'Students', description: 'Student management' },
      { name: 'Courses', description: 'Course management' },
      { name: 'Teachers', description: 'Teacher management' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Optional: just to show it's JWT
        }
      },
      schemas: {
        Student: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string' },
            CourseId: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          },
        },
        Course: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string' },
            TeacherId: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          },
        },
        Teacher: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            department: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          },
        }
      }
    }
  },
  apis: ['**/controllers/*.js'], // your annotated controller files
};

const swaggerSpec = swaggerJSDoc(options);

export const serveSwagger = swaggerUi.serve;
export const setupSwagger = swaggerUi.setup(swaggerSpec);