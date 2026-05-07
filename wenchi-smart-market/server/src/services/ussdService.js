const { addProduct } = require('./productService');

// Simple in-memory session store (in production, use Redis or database)
const sessions = new Map();

const processUSSDRequest = async ({ sessionId, serviceCode, phoneNumber, text }) => {
  const input = text || '';
  const level = input.split('*').length;

  // Initialize session if new
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      level: 0,
      phoneNumber,
      data: {}
    });
  }

  const session = sessions.get(sessionId);

  // Main menu
  if (level === 1) {
    return `CON Welcome to Wenchi Smart Market
1. Register as Seller
2. Browse Products
3. View My Orders`;
  }

  // Handle menu choices
  const menuChoice = input.split('*')[0];

  switch (menuChoice) {
    case '1': // Register as Seller
      if (level === 2) {
        return `CON Enter your business name:`;
      }
      if (level === 3) {
        session.data.businessName = input.split('*')[2];
        return `CON Enter your location:`;
      }
      if (level === 4) {
        session.data.location = input.split('*')[3];
        // In real app, save seller to database
        return `END Registration successful! You can now list products.`;
      }
      break;

    case '2': // Browse Products
      if (level === 2) {
        return `CON Select category:
1. Vegetables
2. Fruits
3. Grains`;
      }
      if (level === 3) {
        const category = input.split('*')[2];
        // In real app, fetch products by category
        return `CON Available products:
1. Tomatoes - K50
2. Onions - K30
3. Potatoes - K40
4. Back to main menu`;
      }
      if (level === 4) {
        const productChoice = input.split('*')[3];
        if (productChoice === '4') {
          return `CON Welcome to Wenchi Smart Market
1. Register as Seller
2. Browse Products
3. View My Orders`;
        }
        session.data.selectedProduct = productChoice;
        return `CON Enter quantity:`;
      }
      if (level === 5) {
        session.data.quantity = input.split('*')[4];
        return `CON Confirm purchase:
Product: Tomatoes
Quantity: ${session.data.quantity}
Total: K${50 * parseInt(session.data.quantity)}
1. Confirm
2. Cancel`;
      }
      if (level === 6) {
        const confirm = input.split('*')[5];
        if (confirm === '1') {
          // Simulate payment
          return `END Payment successful! Order placed. You will receive SMS confirmation.`;
        } else {
          return `END Order cancelled.`;
        }
      }
      break;

    case '3': // View My Orders
      return `END Your recent orders:
- Tomatoes x2 - Delivered
- Onions x1 - In transit`;

    default:
      return `END Invalid choice. Please try again.`;
  }

  return `END Thank you for using Wenchi Smart Market.`;
};

module.exports = { processUSSDRequest };