const SalaService = require('../services/salaService');

exports.getAll = async (req, res) => {
  const salas = await SalaService.getAll();
  res.json(salas);
};

exports.create = async (req, res) => {
  const sala = await SalaService.create(req.body);
  res.status(201).json(sala);
};
