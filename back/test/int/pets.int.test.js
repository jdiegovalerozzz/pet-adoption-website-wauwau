const request = require('supertest');
const db = require('../../src/db');

jest.mock('../../src/db');

const app = require('../../src/server');

describe('Integración /api/pets', () => {
  afterEach(() => jest.clearAllMocks());

  test('GET /api/pets devuelve lista de mascotas', async () => {
    const fakeRows = [
      { id: 1, nombre: 'Fido', especie: 'perro' },
      { id: 2, nombre: 'Michi', especie: 'gato' }
    ];

    db.query.mockResolvedValue({ rows: fakeRows });

    const res = await request(app).get('/api/pets').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toMatchObject({ nombre: 'Fido' });
  });

  test('GET /api/pets/:id maneja mascota no encontrada', async () => {
    // Simular que la consulta no encuentra la mascota
    db.query.mockResolvedValueOnce({ rowCount: 0 });

    const res = await request(app).get('/api/pets/9999').expect(404);
    expect(res.body).toHaveProperty('error', 'Pet not found');
  });

  test('POST /api/pets/:id/adopt crea solicitud correctamente', async () => {
    // 1) SELECT_PET_EXISTS -> pet found
    db.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 1 }] });
    // 2) SELECT_USER_BY_EMAIL -> not found
    db.query.mockResolvedValueOnce({ rowCount: 0 });
    // 3) INSERT_USER -> returns new user id
    db.query.mockResolvedValueOnce({ rows: [{ id_usuario: 55 }] });
    // 4) INSERT_SOLICITUD -> returns solicitud id
    db.query.mockResolvedValueOnce({ rows: [{ id_solicitud: 777, fecha_solicitud: '2025-11-19' }] });

    const body = {
      nombre_contacto: 'Ana',
      correo_contacto: 'ana@example.com',
      telefono_contacto: '555-1234',
      accept_terms: true,
      is_adult: true
    };

    const res = await request(app).post('/api/pets/1/adopt').send(body).expect(201);
    expect(res.body).toHaveProperty('id_solicitud', 777);
    expect(res.body).toHaveProperty('usuario_id', 55);
  });

  test('POST /api/pets/:id/adopt valida accept_terms', async () => {
    // pet exists
    db.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 1 }] });

    const body = { nombre_contacto: 'Juan', is_adult: true };
    const res = await request(app).post('/api/pets/1/adopt').send(body).expect(400);
    // validator returns an errors array from express-validator
    expect(Array.isArray(res.body.errors)).toBe(true);
    const hasAcceptTermsError = res.body.errors.some(e => e.path === 'accept_terms');
    expect(hasAcceptTermsError).toBe(true);
  });

  test('POST /api/pets/:id/adopt valida is_adult', async () => {
    // pet exists
    db.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 1 }] });

    const body = { nombre_contacto: 'Juana', accept_terms: true, is_adult: false };
    const res = await request(app).post('/api/pets/1/adopt').send(body).expect(400);
    // validator returns an errors array; it should include an is_adult error
    expect(Array.isArray(res.body.errors)).toBe(true);
    const hasIsAdultError = res.body.errors.some(e => e.path === 'is_adult');
    expect(hasIsAdultError).toBe(true);
  });
});
