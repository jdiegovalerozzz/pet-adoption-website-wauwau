const { body } = require('express-validator');

const sellsValidator = [
  body('nombre_contacto').notEmpty().withMessage('nombre_contacto is required'),
  body('correo_contacto').isEmail().withMessage('correo_contacto must be a valid email'),
  body('telefono_contacto').notEmpty().withMessage('telefono_contacto is required'),
  body('producto_id').isInt().withMessage('producto_id must be an integer'),
  body('cantidad').isInt({ min: 1 }).withMessage('cantidad must be an integer greater than 0'),

  body('accept_terms').custom(value => value === true).withMessage('accept_terms must be accepted'),

  body('apellido_contacto').optional().isString(),
  body('direccion_contacto').optional().isString(),
  body('estado').optional().isString(),
  body('ciudad').optional().isString(),
  body('codigo_postal').optional().isString(),
  body('telefono_secundario').optional().isString(),
  body('correo_secundario').optional().isEmail(), 
];

module.exports = { sellsValidator };
