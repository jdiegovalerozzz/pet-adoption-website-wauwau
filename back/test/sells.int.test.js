const request = require('supertest');
const db = require('../src/db');

jest.mock('../src/db');

const app = require('../src/server');

describe('Integración /api/sells', () => {
  afterEach(() => jest.clearAllMocks());

  test('GET /api/sells devuelve lista de productos', async () => {
    const fakeRows = [
      { id_producto: 1, nombre: 'Comida', categoria: 'alimento' },
      { id_producto: 2, nombre: 'Collar', categoria: 'accesorio' }
    ];

    db.query.mockResolvedValue({ rows: fakeRows });

    const res = await request(app).get('/api/sells').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toMatchObject({ nombre: 'Comida' });
  });

  test('GET /api/sells/:id maneja producto no encontrado', async () => {
    db.query.mockResolvedValueOnce({ rowCount: 0 });

    const res = await request(app).get('/api/sells/9999').expect(404);
    expect(res.body).toHaveProperty('error', 'Product not found');
  });

  test('POST /api/sells/:id/sell crea venta correctamente', async () => {
    // 1) SELECT_PRODUCT_EXISTS -> product found
    db.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id_producto: 1 }] });
    // 2) SELECT_USER_BY_EMAIL -> not found
    db.query.mockResolvedValueOnce({ rowCount: 0 });
    // 3) INSERT_USER -> returns new user id
    db.query.mockResolvedValueOnce({ rows: [{ id_usuario: 88 }] });
    // 4) INSERT_SELL -> returns venta id
    db.query.mockResolvedValueOnce({ rows: [{ id_venta: 444, fecha_venta: '2025-11-19' }] });

    const body = {
      nombre_contacto: 'Pedro',
      correo_contacto: 'pedro@example.com',
      telefono_contacto: '555-0000',
      producto_id: 1,
      cantidad: 2,
      accept_terms: true
    };

    const res = await request(app).post('/api/sells/1/sell').send(body).expect(201);

    expect(res.body).toHaveProperty('id_venta', 444);
    expect(res.body).toHaveProperty('usuario_id', 88);
  });

  test('POST /api/sells/:id/sell valida accept_terms y campos requeridos', async () => {
    // product exists
    db.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id_producto: 1 }] });

    const body = { nombre_contacto: 'Lu', correo_contacto: 'bad-email', producto_id: 'x' };
    const res = await request(app).post('/api/sells/1/sell').send(body).expect(400);

    expect(Array.isArray(res.body.errors)).toBe(true);
    // debe incluir errores para correo_contacto, telefono_contacto, producto_id, cantidad, accept_terms
    const paths = res.body.errors.map(e => e.path);
    expect(paths).toEqual(expect.arrayContaining(['correo_contacto', 'telefono_contacto', 'producto_id', 'cantidad', 'accept_terms']));
  });
});
