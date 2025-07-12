const express = require('express');
require('dotenv').config();
const cors = require('cors');

// Jobs and routes imports
const liberarReservasVencidas = require('./jobs/liberarReservasVencidas');
const salaRoutes = require('./routes/salas');
const reservaRoutes = require('./routes/reservas');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/salas', salaRoutes);
app.use('/api/reservas', reservaRoutes);

// Cron configuration to run liberarReservasVencidas every minute
const setupCron = (cron) => {
  cron.schedule('* * * * *', liberarReservasVencidas);
};

module.exports = { app, setupCron };
