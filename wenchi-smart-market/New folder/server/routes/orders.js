const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res, next) => {
  try {
    const phone = req.query.phone;
    if (!phone) return res.status(400).json({ success: false, error: 'Missing phone query parameter' });

    const orders = await prisma.order.findMany({
      where: { buyerPhone: phone },
      include: { product: { include: { seller: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { productId, buyerPhone, quantity, paymentMethod } = req.body;
    if (!productId || !buyerPhone || !quantity) {
      return res.status(400).json({ success: false, error: 'productId, buyerPhone and quantity are required' });
    }

    const qty = Number(quantity);
    if (Number.isNaN(qty) || qty <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid quantity' });
    }

    const product = await prisma.product.findUnique({ where: { id: Number(productId) }, include: { seller: true } });
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    if (product.quantity < qty) {
      return res.status(400).json({ success: false, error: 'Not enough product quantity available' });
    }

    const total = product.price * qty;
    const order = await prisma.order.create({
      data: {
        productId: product.id,
        buyerPhone,
        quantity: qty,
        paymentMethod: paymentMethod || 'MTN_MOMO',
        status: 'PENDING',
        total,
      },
    });

    await prisma.product.update({
      where: { id: product.id },
      data: { quantity: product.quantity - qty },
    });

    res.status(201).json({ success: true, data: { ...order, product } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
