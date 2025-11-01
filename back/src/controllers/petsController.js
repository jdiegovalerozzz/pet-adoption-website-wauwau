const db = require('../db');

async function listPets(req, res, next) {
  try {
    const { rows } = await db.query(
      `SELECT id_mascota, nombre, edad, genero, descripcion, disponible, foto_url, refugio_id, fecha_ingreso FROM mascota WHERE disponible = true ORDER BY fecha_ingreso DESC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getPet(req, res, next) {
  try {
    const petId = req.params.id;
    const petQ = await db.query('SELECT * FROM mascota WHERE id_mascota = $1', [petId]);
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
    correo_contacto,
    telefono_contacto,
    direccion_contacto,
    motivo,
    condiciones_hogar
  } = req.body;

  try {
    // comprobar mascota
    const petQ = await db.query('SELECT id_mascota FROM mascota WHERE id_mascota = $1', [petId]);
    if (petQ.rowCount === 0) return res.status(404).json({ error: 'Pet not found' });

    // intentar vincular a usuario existente por correo
    let usuarioId = null;
    if (correo_contacto) {
      const userQ = await db.query('SELECT id_usuario FROM usuario WHERE correo = $1 LIMIT 1', [correo_contacto]);
      if (userQ.rowCount > 0) {
        usuarioId = userQ.rows[0].id_usuario;
      } else {
        // crear usuario interno con los datos del formulario 
        const insertUserQ = await db.query(
          `INSERT INTO usuario (nombre, correo, telefono, direccion, fecha_registro, activo) VALUES ($1,$2,$3,$4,now(),true) RETURNING id_usuario`,
          [nombre_contacto || null, correo_contacto || null, telefono_contacto || null, direccion_contacto || null]
        );
        usuarioId = insertUserQ.rows[0].id_usuario;
      }
    }

    // insertar solicitud de adopcion
    const insertQ = `INSERT INTO solicitud_adopcion (
      usuario_id, nombre_contacto, correo_contacto, telefono_contacto, direccion_contacto, motivo, condiciones_hogar, pendiente
    ) VALUES ($1,$2,$3,$4,$5,$6,$7, true) RETURNING id_solicitud, fecha_solicitud`;

    const { rows } = await db.query(insertQ, [usuarioId, nombre_contacto, correo_contacto, telefono_contacto, direccion_contacto, motivo, condiciones_hogar]);

    res.status(201).json({ id_solicitud: rows[0].id_solicitud, usuario_id: usuarioId, fecha_solicitud: rows[0].fecha_solicitud, status: 'pending' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listPets, getPet, createAdoptionRequest };

//to-do arreglas sentencias acopladas, revisar manejo de usuario ya creados