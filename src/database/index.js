const { Sequelize } = require('sequelize');
const path = require('path');

// Detectar el entorno
const isTest = process.env.NODE_ENV === 'test';

// Cargar variables del entorno según el entorno
require('dotenv').config({
  path: isTest ? path.resolve(__dirname, '../../.env.test') : path.resolve(__dirname, '../../.env'),
});

// Configurar Sequelize según entorno
let sequelize;

if (isTest) {
  // Base de datos en memoria para testing
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  });
} else {
  // Base de datos MySQL para desarrollo/producción 
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false,
    }
  );
}

module.exports = sequelize;
