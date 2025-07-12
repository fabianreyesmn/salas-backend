const { Reserva, Sala } = require('../models');
const { Op } = require('sequelize');

// This function releases expired reservations
async function liberarReservasVencidas() {
  const ahora = new Date();// Obtener la fecha y hora actual

  // Search for active reservations that have expired
  const reservas = await Reserva.findAll({
    where: {
      estado: 'activa',
      fin: { [Op.lt]: ahora }
    }
  });

  // Process each expired reservation
  for (const reserva of reservas) {
    reserva.estado = 'expirada';
    await reserva.save();

    // Release the room if there are no other active reservations
    const reservasActivas = await Reserva.count({
      where: {
        salaId: reserva.salaId,
        estado: 'activa'
      }
    });

    if (reservasActivas === 0) {
      const sala = await Sala.findByPk(reserva.salaId);
      sala.estado = 'disponible';
      await sala.save();
    }
  }

  console.log(` ${reservas.length} reservas vencidas liberadas`);
}

module.exports = liberarReservasVencidas;
