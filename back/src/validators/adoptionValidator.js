const { body } = require('express-validator');

// Helper sanitizer to normalize boolean-like values coming from forms/JSON
const normalizeBoolean = value => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value === 'true' || value === '1';
  if (typeof value === 'number') return value === 1;
  return false;
};

const adoptionValidator = [
  body('nombre_contacto').notEmpty().withMessage('nombre_contacto is required'),
  body('correo_contacto').isEmail().withMessage('correo_contacto must be a valid email'),
  body('telefono_contacto').notEmpty().withMessage('telefono_contacto is required'),

  body('accept_terms')
    .exists().withMessage('accept_terms is required')
    .customSanitizer(normalizeBoolean)
    .custom(value => value === true).withMessage('accept_terms must be accepted'),

  body('apellido_contacto').optional().isString().withMessage('apellido_contacto must be a string'),
  body('conyuge').optional().isString().withMessage('conyuge must be a string'),
  body('direccion_contacto').optional().isString().withMessage('direccion_contacto must be a string'),
  body('estado').optional().isString().withMessage('estado must be a string'),
  body('ciudad').optional().isString().withMessage('ciudad must be a string'),
  body('codigo_postal').optional().isString().withMessage('codigo_postal must be a string'),
  body('telefono_secundario').optional().isString().withMessage('telefono_secundario must be a string'),
  body('correo_secundario').optional().isEmail().withMessage('correo_secundario must be a valid email'),

  body('is_adult')
    .exists().withMessage('is_adult is required')
    .customSanitizer(normalizeBoolean)
    .custom(value => value === true).withMessage('Applicant must be an adult'),

  body('adoption_timeline').optional().isString().withMessage('adoption_timeline must be a string'),
  body('household_composition')
    .optional()
    .custom(value => Array.isArray(value) || typeof value === 'string')
    .withMessage('household_composition must be an array or comma-separated string'),

  body('familiarity_level')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('familiarity_level must be an integer between 1 and 10')
];

module.exports = { adoptionValidator };
