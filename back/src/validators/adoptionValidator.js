const { body } = require('express-validator');

const adoptionValidator = [
  body('nombre_contacto').notEmpty().withMessage('nombre_contacto is required'),
  body('correo_contacto').isEmail().withMessage('correo_contacto must be a valid email'),
  body('telefono_contacto').notEmpty().withMessage('telefono_contacto is required'),
  body('motivo').optional().isString(),
  body('condiciones_hogar').optional().isString()
];

module.exports = { adoptionValidator };
