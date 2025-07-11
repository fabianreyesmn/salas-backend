const { Sala } = require('../models');

exports.getAll = () => Sala.findAll();

exports.create = (data) => Sala.create(data);
