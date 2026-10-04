import express from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/orders - Create a new order
router.post('/', async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod, giftWrap, giftNote } = req.body;
    
    // Check optional authorization header
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const jwtSecret = process.env.JWT_SECRET;
        if (jwtSecret) {
          const decoded = jwt.verify(token, jwtSecret);
          if (decoded && decoded.userId) {
            userId = decoded.userId;
          }
        }
      } catch (err) {
        // Unauthenticated guest order
      }
    }

    const orderNumber = `VEY-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        totalAmount: Number(totalAmount) || 0,
        status: 'Pending',
        shippingAddress: shippingAddress || {},
        paymentMethod: paymentMethod || 'Card',
        paymentStatus: 'Paid',
        giftWrap: Boolean(giftWrap),
        giftNote: giftNote || null,
        items: items || []
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({ success: false, message: 'Failed to process order.' });
  }
});

// GET /api/orders - Get user's orders (or all orders for admin)
router.get('/', authMiddleware, async (req, res) => {
  try {
    let whereClause = { userId: req.user.id };

    // Admin can see all orders if query param ?all=true is passed or by default
    if (req.user.role === 'admin' && req.query.all === 'true') {
      whereClause = {};
    }

    const userOrders = await prisma.order.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    return res.json({
      success: true,
      count: userOrders.length,
      data: userOrders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
});

export default router;
