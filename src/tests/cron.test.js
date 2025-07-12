const request = require('supertest');
const { app } = require('../app');
const { sequelize, Reserva, Sala } = require('../models');
const liberarReservasVencidas = require('../jobs/liberarReservasVencidas');

let salaId;

beforeAll(async () => {
  await Reserva.destroy({ where: {} });
  await Sala.destroy({ where: {} });

  const sala = await Sala.create({
    nombre: 'Sala Cron',
    ubicacion: 'Piso 2',
    capacidad: 6
  });

  salaId = sala.id;

  // Crear una reserva que ya está vencida
  await Reserva.create({
    salaId,
    inicio: '2025-07-10T10:00:00',
    fin: '2025-07-10T11:00:00',
    estado: 'activa'
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Cron job: liberarReservasVencidas', () => {
  it('debe liberar reservas vencidas automáticamente', async () => {
    // Ejecutar manualmente la función del cron
    await liberarReservasVencidas();

    const reservas = await Reserva.findAll({ where: { salaId } });

    expect(reservas.length).toBe(1);
    expect(reservas[0].estado).toBe('expirada');
  });
});
