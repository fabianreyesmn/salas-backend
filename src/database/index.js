const { Sequelize } = require('sequelize');
require('dotenv').config();

// Database connection using Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
    timezone: '-06:00', // Mexico City timezone
  }
);

// Verify the connection
module.exports = sequelize;

// This file sets up the database connection using Sequelize with environment variables
// It uses dotenv to load environment variables from a .env file