const { getAllOrders, createNewOrder } = require('../services/orderService');

const getOrders = async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error('Get Orders Error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

const createOrder = async (req, res) => {
  try {
    const { productId, buyerPhone, quantity } = req.body;
    const order = await createNewOrder({ productId, buyerPhone, quantity });
    res.status(201).json(order);
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

module.exports = { getOrders, createOrder };