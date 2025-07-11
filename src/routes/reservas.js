const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');

router.get('/', reservaController.getAll);
router.post('/', reservaController.create);
// agregar liberar, liberarManual más adelante

module.exports = router;
