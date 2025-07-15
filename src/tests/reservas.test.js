const request = require('supertest');
const { app } = require('../app');
const { sequelize, Sala, Reserva } = require('../models');

let salaId; // Variable to store the real ID of the room

beforeAll(async () => {
  // Sync database first - this creates the tables
  await sequelize.sync({ force: true });
  
  // Create a room for testing
  const sala = await Sala.create({ 
    nombre: 'Sala A', 
    ubicacion: 'Piso 1', 
    capacidad: 10 
  });
  
  salaId = sala.id; // Store the ID of the created room
});

// Clean up reservations before each test to avoid conflicts
beforeEach(async () => {
  await Reserva.destroy({ where: {} });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Reservas API', () => {
  it('POST /api/reservas debe crear una reserva válida (menos de 2 horas)', async () => {
    // Create dates based on the current time
    const ahora = new Date();
    const inicio = new Date(ahora.getTime() + 60 * 60 * 1000); // 1 hour later
    const fin = new Date(inicio.getTime() + 90 * 60 * 1000); // 1.5 hours later the start
    
    const res = await request(app)
      .post('/api/reservas')
      .send({
        salaId: salaId,
        inicio: inicio.toISOString(),
        fin: fin.toISOString()
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.salaId).toBe(salaId);
    expect(res.body.estado).toBe('activa');
  });

  it('POST /api/reservas no debe permitir reservas mayores a 2 horas', async () => {
    // Crear fechas basadas en la hora actual
    const ahora = new Date();
    const inicio = new Date(ahora.getTime() + 2 * 60 * 60 * 1000); // 2 hours later
    const fin = new Date(inicio.getTime() + 3 * 60 * 60 * 1000); // 3 hours later than start
    
    const res = await request(app)
      .post('/api/reservas')
      .send({
        salaId: salaId,
        inicio: inicio.toISOString(),
        fin: fin.toISOString()
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toMatch(/no puede exceder 2 horas/i);
  });

  it('POST /api/reservas no debe permitir reservas solapadas', async () => {
    // Create dates based on the current time
    const ahora = new Date();
    const inicio1 = new Date(ahora.getTime() + 3 * 60 * 60 * 1000); // 3 hours later
    const fin1 = new Date(inicio1.getTime() + 90 * 60 * 1000); // 1.5 hours later
    
    // First, create an initial reservation
    await request(app)
      .post('/api/reservas')
      .send({
        salaId: salaId,
        inicio: inicio1.toISOString(),
        fin: fin1.toISOString()
      });

    // Create dates for the second reservation that overlaps with the first
    const inicio2 = new Date(inicio1.getTime() + 30 * 60 * 1000); // 30 minutes later than the start1
    const fin2 = new Date(inicio2.getTime() + 60 * 60 * 1000); // 1 hour later than the start2
    
    // Then try to create an overlapping reservation
    const res = await request(app)
      .post('/api/reservas')
      .send({
        salaId: salaId,
        inicio: inicio2.toISOString(),
        fin: fin2.toISOString()
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toMatch(/ya reservada/i);
  });

  it('PATCH /api/reservas/:id/liberar debe liberar la reserva manualmente', async () => {
    // Create dates based on the current time
    const ahora = new Date();
    const inicio = new Date(ahora.getTime() + 4 * 60 * 60 * 1000); // 4 hours later
    const fin = new Date(inicio.getTime() + 90 * 60 * 1000); // 1.5 hours later the start
    
    // Create a new active reservation
    const crear = await request(app)
      .post('/api/reservas')
      .send({
        salaId: salaId,
        inicio: inicio.toISOString(),
        fin: fin.toISOString()
      });

    const id = crear.body.id;

    const liberar = await request(app)
      .patch(`/api/reservas/${id}/liberar`);

    expect(liberar.statusCode).toBe(200);
    expect(liberar.body).toHaveProperty('mensaje', 'Reserva liberada manualmente');
  });
});