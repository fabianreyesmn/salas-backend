module.exports = (sequelize, DataTypes) => {
  const Reserva = sequelize.define('Reserva', {
    // Definition of the fields for the Reserva model
    inicio: { type: DataTypes.DATE, allowNull: false },
    fin: { type: DataTypes.DATE, allowNull: false },
    estado: {
      type: DataTypes.ENUM('activa', 'liberada', 'expirada'),
      defaultValue: 'activa'
    }
  });
  return Reserva;
};

// This file defines the Reserva model using Sequelize