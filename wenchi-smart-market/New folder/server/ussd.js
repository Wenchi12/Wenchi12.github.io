const { PrismaClient } = require('@prisma/client');
const { getSession, createSession, updateSession, clearSession } = require('../services/sessionStore');

const prisma = new PrismaClient();

// USSD response helpers
const CON = (text) => `CON ${text}`;  // Continue — show input
const END = (text) => `END ${text}`;  // End session

async function handleUSSD(req, res) {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;

  const phone = phoneNumber || req.body.phone || '260970000000';
  const input = (text || '').trim();
  const parts = input.split('*');
  const latest = parts[parts.length - 1];

  let session = getSession(phone);
  if (!session || input === '') {
    session = createSession(phone);
  }

  try {
    const response = await processState(session, latest, phone);
    res.set('Content-Type', 'text/plain');
    return res.send(response);
  } catch (err) {
    console.error('USSD error:', err);
    clearSession(phone);
    return res.send(END('An error occurred. Please try again.'));
  }
}

async function processState(session, input, phone) {
  const { state, data } = session;

  // ── MAIN MENU ──────────────────────────────────────────
  if (state === 'MAIN_MENU') {
    if (!input) {
      return CON('Welcome to Wenchi\n1. Register\n2. List Product\n3. My Products\n4. View Orders');
    }
    if (input === '1') {
      updateSession(phone, { state: 'REG_NAME' });
      return CON('Enter your full name:');
    }
    if (input === '2') {
      const seller = await prisma.seller.findUnique({ where: { phone } });
      if (!seller) {
        updateSession(phone, { state: 'MAIN_MENU' });
        return CON('Register first.\n\n1. Register\n2. List Product\n3. My Products\n4. View Orders');
      }
      updateSession(phone, { state: 'LIST_NAME', data: { sellerId: seller.id } });
      return CON('Enter product name:');
    }
    if (input === '3') {
      const seller = await prisma.seller.findUnique({ where: { phone }, include: { products: true } });
      if (!seller || seller.products.length === 0) return END('No products listed yet.');
      const list = seller.products.map((p, i) => `${i + 1}. ${p.name} K${p.price}`).join('\n');
      return END(`Your products:\n${list}`);
    }
    if (input === '4') {
      const seller = await prisma.seller.findUnique({ where: { phone } });
      if (!seller) return END('Register first to view orders.');
      const orders = await prisma.order.findMany({
        where: { product: { sellerId: seller.id } },
        include: { product: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });
      if (orders.length === 0) return END('No orders yet.');
      const list = orders.map(o => `${o.product.name} x${o.quantity} - ${o.status}`).join('\n');
      return END(`Recent orders:\n${list}`);
    }
    return CON('Invalid option.\n1. Register\n2. List Product\n3. My Products\n4. View Orders');
  }

  // ── REGISTRATION ──────────────────────────────────────
  if (state === 'REG_NAME') {
    if (!input) return CON('Enter your full name:');
    updateSession(phone, { state: 'REG_LOCATION', data: { ...data, name: input } });
    return CON('Enter your market/location:\n(e.g. Soweto, Kamwala, Chisokone)');
  }

  if (state === 'REG_LOCATION') {
    if (!input) return CON('Enter your market/location:');
    try {
      await prisma.seller.upsert({
        where: { phone },
        update: { name: data.name, location: input },
        create: { phone, name: data.name, location: input },
      });
    } catch (e) {
      console.error('Register error:', e);
      return END('Registration failed. Try again.');
    }
    clearSession(phone);
    return END(`Registered!\nName: ${data.name}\nLocation: ${input}\n\nDial *384# to list products.`);
  }

  // ── LIST PRODUCT ───────────────────────────────────────
  if (state === 'LIST_NAME') {
    if (!input) return CON('Enter product name:');
    updateSession(phone, { state: 'LIST_PRICE', data: { ...data, name: input } });
    return CON('Enter price in Kwacha (K):');
  }

  if (state === 'LIST_PRICE') {
    const price = parseFloat(input);
    if (isNaN(price) || price <= 0) return CON('Invalid price. Enter a number (e.g. 50):');
    updateSession(phone, { state: 'LIST_QTY', data: { ...data, price } });
    return CON('Enter quantity available:');
  }

  if (state === 'LIST_QTY') {
    const qty = parseInt(input);
    if (isNaN(qty) || qty <= 0) return CON('Invalid quantity. Enter a number:');
    updateSession(phone, { state: 'LIST_LOCATION', data: { ...data, quantity: qty } });
    return CON('Enter product location:\n(e.g. Soweto Market, Stall 12)');
  }

  if (state === 'LIST_LOCATION') {
    if (!input) return CON('Enter product location:');
    try {
      const product = await prisma.product.create({
        data: {
          name: data.name,
          price: data.price,
          quantity: data.quantity,
          location: input,
          sellerId: data.sellerId,
        },
      });
      clearSession(phone);
      return END(`Listed!\n${data.name}\nK${data.price} | Qty: ${data.quantity}\n${input}\n\nBuyers can find you online.`);
    } catch (e) {
      console.error('List product error:', e);
      return END('Failed to list product. Try again.');
    }
  }

  // Fallback
  clearSession(phone);
  return END('Session expired. Dial *384# to start again.');
}

module.exports = { handleUSSD };
