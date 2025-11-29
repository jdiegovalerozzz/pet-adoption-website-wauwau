const db = require('../../src/db');
jest.mock('../../src/db');

const { createService } = require('../../src/controllers/servicesController');

describe('Unit - servicesController.createService', () => {
  afterEach(() => jest.clearAllMocks());

  test('should create service and respond 201', async () => {
    const req = {
      params: { id: '1' },
      body: {
        nombre_contacto: 'María',
        telefono_contacto: '555-4321',
        precio: 50,
        accept_terms: true
      }
    };

    db.query
      .mockResolvedValueOnce({ rowCount: 1, rows: [{ id_servicio: 1 }] }) // SELECT_SERVICES_BY_ID
      .mockResolvedValueOnce({ rows: [{ servicio_id: 101, fecha_servicio: '2025-11-20' }] }); // INSERT_SERVICE

    const json = jest.fn();
    const res = { status: jest.fn().mockReturnThis(), json };
    const next = jest.fn();

    await createService(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ servicio_id: 101, status: 'pending' }));
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 400 when accept_terms missing', async () => {
    const req = { params: { id: '1' }, body: { nombre_contacto: 'Lu' } };
    db.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id_servicio: 1 }] }); // service exists

    const json = jest.fn();
    const res = { status: jest.fn().mockReturnThis(), json };
    const next = jest.fn();

    await createService(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ error: 'Terms must be accepted' });
  });
});
