const request = require('supertest');
const { app } = require('../app');
const { sequelize, Reserva, Sala } = require('../models');
const liberarReservasVencidas = require('../jobs/liberarReservasVencidas');

let salaId;

// Configure the database before testing
beforeAll(async () => {
  await sequelize.sync({ force: true });
  await Reserva.destroy({ where: {} });
  await Sala.destroy({ where: {} });

  const sala = await Sala.create({
    nombre: 'Sala Cron',
    ubicacion: 'Piso 2',
    capacidad: 6
  });

  salaId = sala.id;

  // Create an active reservation that should expire
  // Use a past date to ensure it's expired
  const pastDate = new Date();
  pastDate.setHours(pastDate.getHours() - 2); // 2 hours ago
  
  const pastEndDate = new Date(pastDate);
  pastEndDate.setHours(pastEndDate.getHours() + 1); // 1 hour after past start
  
  await Reserva.create({
    salaId,
    inicio: pastDate.toISOString(),
    fin: pastEndDate.toISOString(),
    estado: 'activa'
  });
});

// Clean up the database after testing
afterAll(async () => {
  await sequelize.close();
});

// Tests for the cron job that releases expired reservations
describe('Cron job: liberarReservasVencidas', () => {
  it('debe liberar reservas vencidas automáticamente', async () => {
    await liberarReservasVencidas();

    const reservas = await Reserva.findAll({ where: { salaId } });

    expect(reservas.length).toBe(1);
    expect(reservas[0].estado).toBe('expirada');
  });
});
