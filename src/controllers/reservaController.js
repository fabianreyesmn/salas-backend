const ReservaService = require('../services/reservaService');

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
