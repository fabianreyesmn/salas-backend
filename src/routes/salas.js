const express = require('express');
const router = express.Router();
const salaController = require('../controllers/salaController');

router.get('/', salaController.getAll);
router.post('/', salaController.create);
// agregar PUT y DELETE más adelante

module.exports = router;
