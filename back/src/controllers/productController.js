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

async function createSell(req, res, next) {
  const productId = req.params.id;
  const {
    nombre_contacto,
    apellido_contacto,
    correo_contacto,
    telefono_contacto,
    direccion_contacto,
    estado,
    ciudad,
    codigo_postal,
    cantidad,
    precio,
    accept_terms
  } = req.body;

  try {
    const productQ = await db.query(queries.SELECT_PRODUCT_EXISTS, [productId]);
    if (productQ.rowCount === 0) return res.status(404).json({ error: 'Product not found' });

    let usuarioId = null;
    if (correo_contacto) {
      const userQ = await db.query(queries.SELECT_USER_BY_EMAIL, [correo_contacto]);
      if (userQ.rowCount > 0) {
        usuarioId = userQ.rows[0].id_usuario;
      } else {
        const fullName = [nombre_contacto, apellido_contacto].filter(Boolean).join(' ').trim() || nombre_contacto || null;
        const addressFull = [direccion_contacto, ciudad, estado, codigo_postal].filter(Boolean).join(', ');
        const insertUserQ = await db.query(queries.INSERT_USER, [fullName, correo_contacto || null, telefono_contacto || null, addressFull || null]);
        usuarioId = insertUserQ.rows[0].id_usuario;
      }
    }

    if (accept_terms !== true) return res.status(400).json({ error: 'Terms must be accepted' });

    const contactAddress = direccion_contacto || [direccion_contacto, ciudad, estado, codigo_postal].filter(Boolean).join(', ');

    const qty = cantidad ? Number(cantidad) : 1;
    const priceVal = precio !== undefined ? Number(precio) : null;

    const { rows } = await db.query(queries.INSERT_SELL, [
      usuarioId,
      productId,
      nombre_contacto || null,
      apellido_contacto || null,
      correo_contacto || null,
      telefono_contacto || null,
      contactAddress || null,
      estado || null,
      ciudad || null,
      codigo_postal || null,
      qty,
      priceVal
    ]);

    res.status(201).json({ id_venta: rows[0].id_venta, usuario_id: usuarioId, fecha_venta: rows[0].fecha_venta, status: 'pending' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listProducts, getProduct, createSell };