const request = require('supertest');
const { app } = require('../app');
const { sequelize, Reserva, Sala } = require('../models');
const liberarReservasVencidas = require('../jobs/liberarReservasVencidas');

let salaId;

// Configure the database before testing
beforeAll(async () => {
  await Reserva.destroy({ where: {} });
  await Sala.destroy({ where: {} });

  const sala = await Sala.create({
    nombre: 'Sala Cron',
    ubicacion: 'Piso 2',
    capacidad: 6
  });

  salaId = sala.id;

  // Create an active reservation that will expire
  await Reserva.create({
    salaId,
    inicio: '2025-07-10T10:00:00',
    fin: '2025-07-10T11:00:00',
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
