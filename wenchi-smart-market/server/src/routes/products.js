const express = require('express');
const router = express.Router();
const { getProducts, createProduct } = require('../controllers/productController');

// Routes
router.get('/', getProducts);
router.post('/', createProduct);

module.exports = router;