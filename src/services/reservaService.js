const { Reserva, Sala } = require('../models');
const { Op } = require('sequelize');

// This service handles operations related to reservations

// Gets all reservations
exports.getAll = () => Reserva.findAll();

// Creates a new reservation
exports.create = async ({ salaId, inicio, fin }) => {
  const sala = await Sala.findByPk(salaId);
  if (!sala) throw new Error('Sala no encontrada');

  const inicioDate = new Date(inicio);
  const finDate = new Date(fin);
  const ahora = new Date();

  // Check if the start time is in the past
  if (inicioDate < ahora) {
    throw new Error('No se pueden hacer reservas en el pasado');
  }

  // Validate that the reservation does not exceed 2 hours and that the range is valid
  const diferenciaHoras = (finDate - inicioDate) / (1000 * 60 * 60);
  if (diferenciaHoras > 2) throw new Error('Reserva no puede exceder 2 horas');
  if (diferenciaHoras <= 0) throw new Error('El rango de horas es inválido');

  // Check for overlapping reservations
  const reservasSolapadas = await Reserva.findOne({
    where: {
      salaId,
      estado: 'activa',
      [Op.or]: [
        {
          inicio: { [Op.lt]: finDate },
          fin: { [Op.gt]: inicioDate }
        }
      ]
    }
  });

  if (reservasSolapadas) throw new Error('Sala ya reservada en ese horario');

  // Create the reservation
  const reserva = await Reserva.create({ salaId, inicio, fin });
  await sala.update({ estado: 'reservada' });
  return reserva;
};
