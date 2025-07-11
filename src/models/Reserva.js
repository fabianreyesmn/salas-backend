module.exports = (sequelize, DataTypes) => {
  const Reserva = sequelize.define('Reserva', {
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
// It includes fields for start time, end time, and status with default values
// The status can be 'activa', 'liberada', or 'expirada'