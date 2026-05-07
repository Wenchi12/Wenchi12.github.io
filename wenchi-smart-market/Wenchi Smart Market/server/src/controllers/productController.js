const { getAllProducts, addProduct } = require('../services/productService');

const getProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    console.error('Get Products Error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, price, description, sellerPhone } = req.body;
    const product = await addProduct({ name, price, description, sellerPhone });
    res.status(201).json(product);
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

module.exports = { getProducts, createProduct };