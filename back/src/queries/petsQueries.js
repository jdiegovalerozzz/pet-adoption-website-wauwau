// Centralized SQL queries used by petsController

const LIST_PETS = `
SELECT id_mascota, nombre, especie, edad, genero, descripcion, disponible, foto_url, refugio_id, fecha_ingreso
FROM mascota
WHERE disponible = true
ORDER BY fecha_ingreso DESC
`;

const SELECT_PET_BY_ID = `
SELECT id_mascota, nombre, especie, edad, genero, descripcion, disponible, foto_url, refugio_id, fecha_ingreso
FROM mascota
WHERE id_mascota = $1
`;

const SELECT_PET_EXISTS = `SELECT id_mascota FROM mascota WHERE id_mascota = $1`;

const SELECT_PET_IMAGES = `SELECT orden, url FROM mascota_foto WHERE mascota_id = $1 ORDER BY orden`;

const SELECT_USER_BY_EMAIL = `SELECT id_usuario FROM usuario WHERE correo = $1 LIMIT 1`;

const INSERT_USER = `INSERT INTO usuario (nombre, correo, telefono, direccion, fecha_registro, activo) VALUES ($1,$2,$3,$4,now(),true) RETURNING id_usuario`;

const INSERT_SOLICITUD = `INSERT INTO solicitud_adopcion (
  usuario_id, nombre_contacto, apellido_contacto, correo_contacto, correo_secundario, telefono_contacto, telefono_secundario,
  direccion_contacto, estado, ciudad, codigo_postal, conyuge,
  adoption_timeline, household_composition, condiciones_hogar, familiarity_level, pendiente
) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16, true) RETURNING id_solicitud, fecha_solicitud`;

module.exports = {
  LIST_PETS,
  SELECT_PET_BY_ID,
  SELECT_PET_IMAGES,
  SELECT_USER_BY_EMAIL,
  INSERT_USER,
  INSERT_SOLICITUD,
  SELECT_PET_EXISTS,
};
