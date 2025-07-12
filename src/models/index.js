const sequelize = require('../database');
const { DataTypes } = require('sequelize');

const Sala = require('./Sala')(sequelize, DataTypes);
const Reserva = require('./Reserva')(sequelize, DataTypes);

// Define relationships
Sala.hasMany(Reserva, { foreignKey: 'salaId' });
Reserva.belongsTo(Sala, { foreignKey: 'salaId' });

module.exports = { sequelize, Sala, Reserva };

// This file initializes the Sequelize models and their relationships