const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Movie Theater API',
      version: '1.0.0',
      description: 'API documentation for Movie Theater application',
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            user_id: {
              type: 'integer',
              description: 'The user ID'
            },
            username: {
              type: 'string',
              description: 'The username'
            },
            full_name: {
              type: 'string',
              description: 'The full name of the user'
            },
            dob: {
              type: 'string',
              format: 'date',
              description: 'Date of birth'
            },
            sex: {
              type: 'string',
              enum: ['Male', 'Female', 'Other'],
              description: 'Gender of the user'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address'
            },
            identity_card: {
              type: 'string',
              description: 'Identity card number'
            },
            phone_number: {
              type: 'string',
              description: 'Phone number'
            },
            role: {
              type: 'string',
              enum: ['admin', 'employee', 'member', 'guest'],
              description: 'User role'
            },
            status: {
              type: 'string',
              enum: ['active', 'locked'],
              description: 'User status'
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              description: 'Username for registration'
            },
            password: {
              type: 'string',
              description: 'Password for registration'
            },
            full_name: {
              type: 'string',
              description: 'Full name of the user'
            },
            dob: {
              type: 'string',
              format: 'date',
              description: 'Date of birth'
            },
            sex: {
              type: 'string',
              enum: ['Male', 'Female', 'Other'],
              description: 'Gender'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address'
            },
            identity_card: {
              type: 'string',
              description: 'Identity card number'
            },
            phone_number: {
              type: 'string',
              description: 'Phone number'
            },
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              description: 'Username for login'
            },
            password: {
              type: 'string',
              description: 'Password for login'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Response message'
            },
            user: {
              $ref: '#/components/schemas/User'
            },
            token: {
              type: 'string',
              description: 'JWT token'
            }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = specs; 