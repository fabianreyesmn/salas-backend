const express = require('express');
const router = express.Router();
const salaController = require('../controllers/salaController');

// Routes for handling rooms
router.get('/', salaController.getAll);
router.post('/', salaController.create);

module.exports = router;
