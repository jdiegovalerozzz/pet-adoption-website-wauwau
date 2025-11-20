const db = require('../../src/db');
jest.mock('../../src/db');

const { createAdoptionRequest } = require('../../src/controllers/petsController');

describe('Unit - petsController.createAdoptionRequest', () => {
  afterEach(() => jest.clearAllMocks());

  test('should create adoption request and respond 201', async () => {
    const req = {
      params: { id: '1' },
      body: {
        nombre_contacto: 'Ana',
        correo_contacto: 'ana@example.com',
        telefono_contacto: '555-1234',
        accept_terms: true,
        is_adult: true
      }
    };

    db.query
      .mockResolvedValueOnce({ rowCount: 1, rows: [{ id_mascota: 1 }] }) // SELECT_PET_EXISTS
      .mockResolvedValueOnce({ rowCount: 0 }) // SELECT_USER_BY_EMAIL
      .mockResolvedValueOnce({ rows: [{ id_usuario: 55 }] }) // INSERT_USER
      .mockResolvedValueOnce({ rows: [{ id_solicitud: 777, fecha_solicitud: '2025-11-20' }] }); // INSERT_SOLICITUD

    const json = jest.fn();
    const res = { status: jest.fn().mockReturnThis(), json };
    const next = jest.fn();

    await createAdoptionRequest(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ id_solicitud: 777, usuario_id: 55 }));
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 400 when accept_terms is not true', async () => {
    const req = {
      params: { id: '2' },
      body: { nombre_contacto: 'Juan', is_adult: true, accept_terms: false }
    };

    db.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id_mascota: 2 }] }); // pet exists

    const json = jest.fn();
    const res = { status: jest.fn().mockReturnThis(), json };
    const next = jest.fn();

    await createAdoptionRequest(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ error: 'Terms must be accepted' });
  });
});
