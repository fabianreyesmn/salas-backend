const ReservaService = require('../services/reservaService');
const { Reserva, Sala } = require('../models');

exports.getAll = async (req, res) => {
  const reservas = await ReservaService.getAll();
  res.json(reservas);
};

exports.create = async (req, res) => {
  try {
    const reserva = await ReservaService.create(req.body);
    res.status(201).json(reserva);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.liberarManual = async (req, res) => {
  const id = req.params.id;

  try {
    const reserva = await Reserva.findByPk(id);
    if (!reserva || reserva.estado !== 'activa') {
      return res.status(404).json({ error: 'Reserva no encontrada o ya finalizada' });
    }

    reserva.estado = 'liberada';
    await reserva.save();

    // revisar si es la única activa para liberar sala
    const activas = await Reserva.count({
      where: {
        salaId: reserva.salaId,
        estado: 'activa'
      }
    });

    if (activas === 0) {
      const sala = await Sala.findByPk(reserva.salaId);
      sala.estado = 'disponible';
      await sala.save();
    }

    res.json({ mensaje: 'Reserva liberada manualmente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
