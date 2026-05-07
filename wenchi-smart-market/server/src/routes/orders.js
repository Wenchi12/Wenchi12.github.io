const express = require('express');
const router = express.Router();
const { createOrder, getOrders } = require('../controllers/orderController');

// Routes
router.get('/', getOrders);
router.post('/', createOrder);

module.exports = router;