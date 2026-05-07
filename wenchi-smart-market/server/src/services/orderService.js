const { getProductById } = require('./productService');

// In-memory order store (in production, use database)
let orders = [];

const getAllOrders = async () => {
  return orders;
};

const createNewOrder = async ({ productId, buyerPhone, quantity }) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  const totalAmount = product.price * parseInt(quantity);

  const newOrder = {
    id: orders.length + 1,
    productId: parseInt(productId),
    buyerPhone,
    quantity: parseInt(quantity),
    totalAmount,
    status: 'pending',
    createdAt: new Date()
  };

  orders.push(newOrder);
  return newOrder;
};

module.exports = { getAllOrders, createNewOrder };