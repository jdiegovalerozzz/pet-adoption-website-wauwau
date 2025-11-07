const db = require('../db');

async function listPets(req, res, next) {
  try {
    const { rows } = await db.query(
      `SELECT id_mascota, nombre, especie, edad, genero, descripcion, disponible, foto_url, refugio_id, fecha_ingreso FROM mascota WHERE disponible = true ORDER BY fecha_ingreso DESC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getPet(req, res, next) {
  try {
    const petId = req.params.id;
  const petQ = await db.query('SELECT id_mascota, nombre, especie, edad, genero, descripcion, disponible, foto_url, refugio_id, fecha_ingreso FROM mascota WHERE id_mascota = $1', [petId]);
    if (petQ.rowCount === 0) return res.status(404).json({ error: 'Pet not found' });

    const imagesQ = await db.query('SELECT orden, url FROM mascota_foto WHERE mascota_id = $1 ORDER BY orden', [petId]);
    const pet = petQ.rows[0];
    pet.fotos = imagesQ.rows.map(r => ({ orden: r.orden, url: r.url }));
    res.json(pet);
  } catch (err) {
    next(err);
  }
}

async function createAdoptionRequest(req, res, next) {
  const petId = req.params.id;
  const {
    nombre_contacto,
    apellido_contacto,
    correo_contacto,
    correo_secundario,
    telefono_contacto,
    telefono_secundario,
    direccion_contacto,
    estado,
    ciudad,
    codigo_postal,
    conyuge,
    condiciones_hogar,
    accept_terms,

    is_adult,
    adoption_timeline,
    household_composition,
    familiarity_level
  } = req.body;

  try {
    const petQ = await db.query('SELECT id_mascota FROM mascota WHERE id_mascota = $1', [petId]);
    if (petQ.rowCount === 0) return res.status(404).json({ error: 'Pet not found' });

    let usuarioId = null;
    if (correo_contacto) {
      const userQ = await db.query('SELECT id_usuario FROM usuario WHERE correo = $1 LIMIT 1', [correo_contacto]);
      if (userQ.rowCount > 0) {
        usuarioId = userQ.rows[0].id_usuario;
      } else {
        const fullName = [nombre_contacto, apellido_contacto].filter(Boolean).join(' ').trim() || nombre_contacto || null;
        const addressFull = [direccion_contacto, ciudad, estado, codigo_postal].filter(Boolean).join(', ');
        const insertUserQ = await db.query(
          `INSERT INTO usuario (nombre, correo, telefono, direccion, fecha_registro, activo) VALUES ($1,$2,$3,$4,now(),true) RETURNING id_usuario`,
          [fullName, correo_contacto || null, telefono_contacto || null, addressFull || null]
        );
        usuarioId = insertUserQ.rows[0].id_usuario;
      }
    }
  if (accept_terms !== true) return res.status(400).json({ error: 'Terms must be accepted' });
  if (is_adult !== undefined && is_adult !== true) return res.status(400).json({ error: 'Applicant must be an adult to submit a request' });

  let hhArray = null;
  if (Array.isArray(household_composition)) hhArray = household_composition.map(String).filter(Boolean);
  else if (typeof household_composition === 'string' && household_composition.trim() !== '') {
    try {
      const parsed = JSON.parse(household_composition);
      if (Array.isArray(parsed)) hhArray = parsed.map(String).filter(Boolean);
    } catch (e) {
      hhArray = household_composition.split(',').map(s => s.trim()).filter(Boolean);
    }
  }

  const insertQ = `INSERT INTO solicitud_adopcion (
    usuario_id, nombre_contacto, apellido_contacto, correo_contacto, correo_secundario, telefono_contacto, telefono_secundario,
    direccion_contacto, estado, ciudad, codigo_postal, conyuge,
    adoption_timeline, household_composition, condiciones_hogar, familiarity_level, pendiente
  ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16, true) RETURNING id_solicitud, fecha_solicitud`;

  const contactAddress = direccion_contacto || [direccion_contacto, ciudad, estado, codigo_postal].filter(Boolean).join(', ');

  const { rows } = await db.query(insertQ, [
    usuarioId,
    nombre_contacto || null,
    apellido_contacto || null,
    correo_contacto || null,
    correo_secundario || null,
    telefono_contacto || null,
    telefono_secundario || null,
    contactAddress || null,
    estado || null,
    ciudad || null,
    codigo_postal || null,
    conyuge || null,
    adoption_timeline || null,
    hhArray,
    condiciones_hogar || null,
    familiarity_level || null
  ]);

  res.status(201).json({ id_solicitud: rows[0].id_solicitud, usuario_id: usuarioId, fecha_solicitud: rows[0].fecha_solicitud, status: 'pending' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listPets, getPet, createAdoptionRequest };

//to-do arreglar sentencias acopladas, revisar manejo de usuario ya creados