module.exports = (sequelize, DataTypes) => {
  const Sala = sequelize.define('Sala', {
    // Definition of the fields for the Sala model
    nombre: { type: DataTypes.STRING, allowNull: false },
    ubicacion: { type: DataTypes.STRING, allowNull: false },
    capacidad: { type: DataTypes.INTEGER, allowNull: false },
    estado: {
      type: DataTypes.ENUM('disponible', 'reservada'),
      defaultValue: 'disponible'
    }
  });
  return Sala;
};

// This file defines the Sala model using Sequelize