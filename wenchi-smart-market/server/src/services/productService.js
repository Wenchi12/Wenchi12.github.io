// In-memory product store (in production, use database)
let products = [
  {
    id: 1,
    name: 'Tomatoes',
    price: 50,
    description: 'Fresh red tomatoes',
    sellerPhone: '+260123456789',
    createdAt: new Date()
  },
  {
    id: 2,
    name: 'Onions',
    price: 30,
    description: 'Yellow onions',
    sellerPhone: '+260123456789',
    createdAt: new Date()
  }
];

const getAllProducts = async () => {
  return products;
};

const addProduct = async ({ name, price, description, sellerPhone }) => {
  const newProduct = {
    id: products.length + 1,
    name,
    price: parseFloat(price),
    description,
    sellerPhone,
    createdAt: new Date()
  };
  products.push(newProduct);
  return newProduct;
};

const getProductById = async (id) => {
  return products.find(p => p.id === parseInt(id));
};

module.exports = { getAllProducts, addProduct, getProductById };