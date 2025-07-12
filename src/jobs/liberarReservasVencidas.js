const { Reserva, Sala } = require('../models');
const { Op } = require('sequelize');

async function liberarReservasVencidas() {
  const ahora = new Date();

  const reservas = await Reserva.findAll({
    where: {
      estado: 'activa',
      fin: { [Op.lt]: ahora }
    }
  });

  for (const reserva of reservas) {
    reserva.estado = 'expirada';
    await reserva.save();

    // liberar la sala solo si no tiene otra reserva activa
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
