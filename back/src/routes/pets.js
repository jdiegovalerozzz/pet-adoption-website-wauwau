const express = require('express');
const { validationResult } = require('express-validator');
const controller = require('../controllers/petsController');
const { adoptionValidator } = require('../validators/adoptionValidator');

const router = express.Router();

router.get('/', controller.listPets);
router.get('/:id', controller.getPet);

router.post('/:id/adopt', adoptionValidator, (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
	controller.createAdoptionRequest(req, res, next);
});

module.exports = router;
