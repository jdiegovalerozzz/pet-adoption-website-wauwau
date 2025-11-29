const { body } = require('express-validator');

const adoptionValidator = [
  body('nombre_contacto').notEmpty().withMessage('nombre_contacto is required'),
  body('correo_contacto').isEmail().withMessage('correo_contacto must be a valid email'),
  body('telefono_contacto').notEmpty().withMessage('telefono_contacto is required'),

  body('accept_terms').custom(value => value === true).withMessage('accept_terms must be accepted'),

  body('apellido_contacto').optional().isString(),
  body('conyuge').optional().isString(),
  body('direccion_contacto').optional().isString(),
  body('estado').optional().isString(),
  body('ciudad').optional().isString(),
  body('codigo_postal').optional().isString(),
  body('telefono_secundario').optional().isString(),
  body('correo_secundario').optional().isEmail(),

  body('is_adult').custom(value => value === true).withMessage('Applicant must be an adult'),
  body('adoption_timeline').optional().isString(),
  body('household_composition').optional(), 
  body('familiarity_level').optional().isInt({ min: 1, max: 10 })
];

module.exports = { adoptionValidator };
