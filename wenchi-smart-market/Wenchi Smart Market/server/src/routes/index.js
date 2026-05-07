const express = require('express');
const router = express.Router();

// Import route modules
const ussdRoutes = require('./ussd');
const productRoutes = require('./products');
const orderRoutes = require('./orders');

// Mount routes
router.use('/ussd', ussdRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);

module.exports = router;