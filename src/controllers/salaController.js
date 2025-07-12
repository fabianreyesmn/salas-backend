const SalaService = require('../services/salaService');

// Get all rooms
exports.getAll = async (req, res) => {
  const salas = await SalaService.getAll();
  res.json(salas);
};

// Create a new room
exports.create = async (req, res) => {
  const sala = await SalaService.create(req.body);
  res.status(201).json(sala);
};
