const { Reserva, Sala } = require('../models');
const { Op } = require('sequelize');

exports.getAll = () => Reserva.findAll();

exports.create = async ({ salaId, inicio, fin }) => {
  const sala = await Sala.findByPk(salaId);
  if (!sala) throw new Error('Sala no encontrada');

  const inicioDate = new Date(inicio);
  const finDate = new Date(fin);
  const ahora = new Date();

  // Validar que la fecha de inicio no sea en el pasado
  if (inicioDate < ahora) {
    throw new Error('No se pueden hacer reservas en el pasado');
  }

  const diferenciaHoras = (finDate - inicioDate) / (1000 * 60 * 60);
  if (diferenciaHoras > 2) throw new Error('Reserva no puede exceder 2 horas');
  if (diferenciaHoras <= 0) throw new Error('El rango de horas es inválido');

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

  const reserva = await Reserva.create({ salaId, inicio, fin });
  await sala.update({ estado: 'reservada' });
  return reserva;
};
