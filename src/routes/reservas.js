const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');

// Routes for handling reservations
router.get('/', reservaController.getAll);
router.post('/', reservaController.create);

router.patch('/:id/liberar', reservaController.liberarManual);

module.exports = router;
