const { Sala, Reserva } = require('../models');

// Service for handling room operations

// Gets all rooms
exports.getAll = () => Sala.findAll();

// Creates a new room
exports.create = (data) => Sala.create(data);

// Deletes a room by ID
exports.delete = async (id) => {
  const sala = await Sala.findByPk(id);
  if (!sala) return { error: 'Sala no encontrada' };

  const reservasActivas = await Reserva.findAll({
    where: {
      salaId: id,
      estado: 'activa',
    },
  });

  if (reservasActivas.length > 0) {
    return { error: 'No se puede eliminar: la sala tiene reservas activas' };
  }

  await sala.destroy();
  return { mensaje: 'Eliminada' };
};
