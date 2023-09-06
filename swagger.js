const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.0'})
// https://github.com/davibaltar/swagger-autogen
const doc = {
    info: {
      version: '1.10.1',
      title: 'Kubero',
      description: 'Kubero is a web-based tool deploy applications on a Kubernetes clusters. It provides a simple and intuitive interface to manage your clusters, applications, and pipelines.',
    },
    host: 'localhost:2000',
    basePath: '/api',
    schemes: ['http'],

    tags: [
      {
        name: 'Apps',
        description: 'Application management',
      },
      {
        name: 'Addons',
        description: 'Addons management',
      },
      {
        name: 'Config',
        description: 'Configuration management',
      },
      {
        name: 'Pipeline',
        description: 'Pipeline management',
      },
      {
        name: 'Settings',
        description: 'Settings management',
      },
      {
        name: 'UI',
        description: 'UI endpoints - require session',
      },
    ],

    securityDefinitions: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      }
    }
  };

swaggerAutogen('./swagger.json', [
  './dist/routes/addons.js',
  './dist/routes/apps.js',
  './dist/routes/auth.js',
  './dist/routes/config.js',
  './dist/routes/logs.js',
  './dist/routes/pipelines.js',
  './dist/routes/repo.js',
  './dist/routes/settings.js',
  './dist/routes/services.js',
], doc);