const request = require('supertest');
const { app } = require('../app');
const { sequelize, Sala, Reserva } = require('../models');

let salaId; // Variable to store the real ID of the room

beforeAll(async () => {
  // Clean up the database before testing
  await Reserva.destroy({ where: {} });
  await Sala.destroy({ where: {} });
  
  // Create a room for testing
  const sala = await Sala.create({ 
    nombre: 'Sala A', 
    ubicacion: 'Piso 1', 
    capacidad: 10 
  });
  
  salaId = sala.id; // Store the ID of the created room
});

afterAll(async () => {
  await sequelize.close();
});

describe('Reservas API', () => {
  it('POST /api/reservas debe crear una reserva válida (menos de 2 horas)', async () => {
    const res = await request(app)
      .post('/api/reservas')
      .send({
        salaId: salaId, // Use the real ID of the room
        inicio: '2025-07-11T10:00:00',
        fin: '2025-07-11T11:30:00'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.salaId).toBe(salaId);
    expect(res.body.estado).toBe('activa');
  });

  it('POST /api/reservas no debe permitir reservas mayores a 2 horas', async () => {
    const res = await request(app)
      .post('/api/reservas')
      .send({
        salaId: salaId, // Use the real ID of the room
        inicio: '2025-07-11T12:00:00',
        fin: '2025-07-11T15:00:00'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toMatch(/no puede exceder 2 horas/i);
  });

  it('POST /api/reservas no debe permitir reservas solapadas', async () => {
    const res = await request(app)
      .post('/api/reservas')
      .send({
        salaId: salaId, // Use the real ID of the room
        inicio: '2025-07-11T10:30:00',
        fin: '2025-07-11T11:45:00'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toMatch(/ya reservada/i);
  });

  it('PATCH /api/reservas/:id/liberar debe liberar la reserva manualmente', async () => {
    // Create a new active reservation
    const crear = await request(app)
      .post('/api/reservas')
      .send({
        salaId: salaId, // Use the real ID of the room
        inicio: '2025-07-11T13:00:00',
        fin: '2025-07-11T14:30:00'
      });

    const id = crear.body.id;

    const liberar = await request(app)
      .patch(`/api/reservas/${id}/liberar`);

    expect(liberar.statusCode).toBe(200);
    expect(liberar.body).toHaveProperty('mensaje', 'Reserva liberada manualmente');
  });
});