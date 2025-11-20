const db = require('../db');
const queries = require('../queries/petsQueries');

async function listServices(req, res, next) {
  try {
    const { rows } = await db.query(queries.LIST_SERVICES);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getService(req, res, next) {
  try {
    const serviceId = req.params.id;
    const serviceQ = await db.query(queries.SELECT_SERVICES_BY_ID, [serviceId]);
    if (serviceQ.rowCount === 0) return res.status(404).json({ error: 'Service not found' });
    const service = serviceQ.rows[0];
    res.json(service);
  } catch (err) {
    next(err);
  }
}

async function createService(req, res, next) {
  try {
    const {
      nombre_contacto,
      apellido_contacto,
      telefono_contacto,
      direccion_contacto,
      estado,
      ciudad,
      precio,
      accept_terms
    } = req.body;

    if (accept_terms !== true) return res.status(400).json({ error: 'Terms must be accepted' });

    const servicioId = req.params.id ? Number(req.params.id) : null;

    if (servicioId !== null) {
      const svcQ = await db.query(queries.SELECT_SERVICES_BY_ID, [servicioId]);
      if (svcQ.rowCount === 0) return res.status(404).json({ error: 'Service not found' });
    }

    const insertQ = await db.query(queries.INSERT_SERVICE, [
      nombre_contacto || null,
      apellido_contacto || null,
      telefono_contacto || null,
      direccion_contacto || null,
      estado || null,
      ciudad || null,
      precio !== undefined ? Number(precio) : null
    ]);

    res.status(201).json({ servicio_id: insertQ.rows[0].servicio_id, fecha_servicio: insertQ.rows[0].fecha_servicio, status: 'pending' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listServices, getService, createService };
