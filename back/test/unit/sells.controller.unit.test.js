const db = require('../../src/db');
jest.mock('../../src/db');

const { createSell } = require('../../src/controllers/productController');

describe('Unit - productController.createSell', () => {
  afterEach(() => jest.clearAllMocks());

  test('should create sell and respond 201', async () => {
    const req = {
      params: { id: '1' },
      body: {
        nombre_contacto: 'Pedro',
        correo_contacto: 'pedro@example.com',
        telefono_contacto: '555-0000',
        producto_id: 1,
        cantidad: 2,
        accept_terms: true
      }
    };

    db.query
      .mockResolvedValueOnce({ rowCount: 1, rows: [{ id_producto: 1 }] }) // SELECT_PRODUCT_EXISTS
      .mockResolvedValueOnce({ rowCount: 0 }) // SELECT_USER_BY_EMAIL
      .mockResolvedValueOnce({ rows: [{ id_usuario: 88 }] }) // INSERT_USER
      .mockResolvedValueOnce({ rows: [{ id_venta: 444, fecha_venta: '2025-11-20' }] }); // INSERT_SELL

    const json = jest.fn();
    const res = { status: jest.fn().mockReturnThis(), json };
    const next = jest.fn();

    await createSell(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ id_venta: 444, usuario_id: 88 }));
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 400 when accept_terms missing', async () => {
    const req = { params: { id: '1' }, body: { nombre_contacto: 'Lu' } };
    db.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id_producto: 1 }] }); // product exists

    const json = jest.fn();
    const res = { status: jest.fn().mockReturnThis(), json };
    const next = jest.fn();

    await createSell(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ error: 'Terms must be accepted' });
  });
});
