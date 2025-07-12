const { Sala } = require('../models');

// Service for handling room operations

// Gets all rooms
exports.getAll = () => Sala.findAll();

// Creates a new room
exports.create = (data) => Sala.create(data);
