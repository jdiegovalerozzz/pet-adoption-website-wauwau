const db = require('../db');
const queries = require('../queries/petsQueries'); 

/**
 * @desc    Listar todos los productos
 * @route   GET /api/products
 * @access  Public
 */
async function listProducts(req, res, next) {
  try {
    // Usamos la query que sí existe
    const { rows } = await db.query(queries.LIST_PRODUCTS); 
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

/**
 * @desc    Obtener un producto por ID
 * @route   GET /api/products/:id
 * @access  Public
 */
async function getProduct(req, res, next) {
  try {
    const productId = req.params.id;
   
    const productQ = await db.query(queries.SELECT_PRODUCTS_BY_ID, [productId]); 
    
    if (productQ.rowCount === 0) return res.status(404).json({ error: 'Product not found' });

   
    
    const product = productQ.rows[0];
    res.json(product);

  } catch (err) {
    next(err);
  }
}

module.exports = { listProducts, getProduct };