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

// Delete a room
exports.delete = async (req, res) => {
  try {
    const resultado = await SalaService.delete(req.params.id);
    if (resultado.error) {
      return res.status(400).json({ error: resultado.error });
    }
    res.json({ mensaje: 'Sala eliminada correctamente' });
  } catch (err) {
    console.error('Error real al eliminar la sala:', err);
    res.status(500).json({ error: 'Error al eliminar la sala' });
  }
};

