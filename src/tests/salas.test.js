const request = require('supertest');
const { app } = require('../app');
const { sequelize } = require('../models');

afterAll(async () => {
  await sequelize.close();
});

describe('Salas API', () => {
  it('GET /api/salas debe devolver un array', async () => {
    const res = await request(app).get('/api/salas');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/salas debe crear una nueva sala', async () => {
    const res = await request(app)
      .post('/api/salas')
      .send({ nombre: 'Sala Test', ubicacion: 'Segundo piso', capacidad: 12 });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nombre).toBe('Sala Test');
    expect(res.body.ubicacion).toBe('Segundo piso');
    expect(res.body.capacidad).toBe(12);
  });
});
