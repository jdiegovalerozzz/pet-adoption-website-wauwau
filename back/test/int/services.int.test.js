const request = require('supertest');
const db = require('../../src/db');

jest.mock('../../src/db');

const app = require('../../src/server');

describe('Integración /api/services', () => {
  afterEach(() => jest.clearAllMocks());

  test('GET /api/services devuelve lista de servicios', async () => {
    const fakeRows = [
      { id_servicio: 1, nombre: 'Paseo', categoria: 'servicio' },
      { id_servicio: 2, nombre: 'Baño', categoria: 'servicio' }
    ];

    db.query.mockResolvedValue({ rows: fakeRows });

    const res = await request(app).get('/api/services').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toMatchObject({ nombre: 'Paseo' });
  });

  test('GET /api/services/:id maneja servicio no encontrado', async () => {
    db.query.mockResolvedValueOnce({ rowCount: 0 });

    const res = await request(app).get('/api/services/9999').expect(404);
    expect(res.body).toHaveProperty('error', 'Service not found');
  });

  test('POST /api/services/:id/sell crea servicio correctamente', async () => {
    // 1) SELECT_SERVICES_BY_ID -> service found
    db.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id_servicio: 1 }] });
    // 2) INSERT_SERVICE -> returns servicio id
    db.query.mockResolvedValueOnce({ rows: [{ servicio_id: 101, fecha_servicio: '2025-11-20' }] });

    const body = {
      nombre_contacto: 'María',
      telefono_contacto: '555-4321',
      precio: 50,
      accept_terms: true
    };

    const res = await request(app).post('/api/services/1/sell').send(body).expect(201);

    expect(res.body).toHaveProperty('servicio_id', 101);
    expect(res.body).toHaveProperty('status', 'pending');
  });

  test('POST /api/services/:id/sell valida campos requeridos y accept_terms', async () => {
    // service exists but validation fails before controller
    db.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id_servicio: 1 }] });

    const body = { nombre_contacto: '', correo_contacto: 'bad-email' };
    const res = await request(app).post('/api/services/1/sell').send(body).expect(400);

    expect(Array.isArray(res.body.errors)).toBe(true);
    const paths = res.body.errors.map(e => e.path);
    expect(paths).toEqual(expect.arrayContaining(['nombre_contacto', 'telefono_contacto', 'accept_terms']));
  });
});
