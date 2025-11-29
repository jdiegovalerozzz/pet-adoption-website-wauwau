const express = require('express');
const { validationResult } = require('express-validator');
const controller = require('../controllers/productController');
const { sellsValidator } = require('../validators/sellsValidator');

const router = express.Router();

router.get('/', controller.listProducts);
router.get('/:id', controller.getProduct);

router.post('/:id/sell', sellsValidator, (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
	controller.createSell(req, res, next);
});

module.exports = router;
