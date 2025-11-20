const express = require('express');
const { validationResult } = require('express-validator');
const controller = require('../controllers/servicesController');
const { servicesValidator } = require('../validators/servicesValidator');

const router = express.Router();

router.get('/', controller.listServices);
router.get('/:id', controller.getService);

router.post('/:id/sell', servicesValidator, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  controller.createService(req, res, next);
});

module.exports = router;
