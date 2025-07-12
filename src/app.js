const express = require('express');
require('dotenv').config();
const cors = require('cors');

const liberarReservasVencidas = require('./jobs/liberarReservasVencidas');
const salaRoutes = require('./routes/salas');
const reservaRoutes = require('./routes/reservas');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/salas', salaRoutes);
app.use('/api/reservas', reservaRoutes);

// Exportar cron
const setupCron = (cron) => {
  cron.schedule('* * * * *', liberarReservasVencidas);
};

module.exports = { app, setupCron };
