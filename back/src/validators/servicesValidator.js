const { body } = require('express-validator');

const servicesValidator = [
  body('nombre_contacto').notEmpty().withMessage('nombre_contacto is required'),
  body('correo_contacto').optional().isEmail().withMessage('correo_contacto must be a valid email'),
  body('telefono_contacto').notEmpty().withMessage('telefono_contacto is required'),
  body('precio').optional().isNumeric().withMessage('precio must be numeric'),
  body('accept_terms').custom(value => value === true).withMessage('accept_terms must be accepted'),
  body('apellido_contacto').optional().isString(),
  body('direccion_contacto').optional().isString(),
  body('estado').optional().isString(),
  body('ciudad').optional().isString(),
];

module.exports = { servicesValidator };
