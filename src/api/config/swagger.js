// src/config/swagger.js
require("dotenv").config();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const PORT = process.env.PORT || 8080;

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Fitness-Tracker API",
    version: "1.0.0",
    description: "CRUD operation for Fitness-Tracker website",
  },
  servers: [
    {
      url: `http://localhost:${PORT}`, // Change to your server URL
      description: "Development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/api/routes/*.js"], // Path to the API routes files
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
