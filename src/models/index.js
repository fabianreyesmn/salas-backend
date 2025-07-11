const sequelize = require('../database');
const { DataTypes } = require('sequelize');

const Sala = require('./Sala')(sequelize, DataTypes);
const Reserva = require('./Reserva')(sequelize, DataTypes);

Sala.hasMany(Reserva, { foreignKey: 'salaId' });
Reserva.belongsTo(Sala, { foreignKey: 'salaId' });

module.exports = { sequelize, Sala, Reserva };

// This file initializes the Sequelize models and their associations
// It imports the Sala and Reserva models and sets up a one-to-many relationship
// between Sala and Reserva, where a Sala can have many Reservas
// and each Reserva belongs to a Sala. It exports the sequelize instance and the models.