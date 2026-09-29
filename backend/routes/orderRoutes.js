import express from 'express';

const router = express.Router();

const orders = [];

router.post('/', (req, res) => {
  const orderData = req.body;
  const newOrder = {
    ...orderData,
    id: `VEY-${Math.floor(100000 + Math.random() * 900000)}`,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  orders.push(newOrder);
  res.status(201).json({ success: true, message: 'Order created successfully', data: newOrder });
});

router.get('/', (req, res) => {
  res.json({ success: true, count: orders.length, data: orders });
});

export default router;
