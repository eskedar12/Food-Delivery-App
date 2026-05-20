import express from 'express';
import Order from '../models/Order.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create order (Customer only)
router.post('/', auth, async (req, res) => {
  try {
    console.log("📦 Creating order for user:", req.user.id);
    
    const order = new Order({
      ...req.body,
      user: req.user.id,
    });
    
    const savedOrder = await order.save();
    console.log("✅ Order saved:", savedOrder._id);
    
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("❌ Order error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's own orders (Customer only)
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get ALL orders (Admin only)
router.get('/', auth, auth.isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single order (Admin or owner)
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (Admin only)
router.put('/:id/status', auth, auth.isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign driver to order (Admin only)
router.put('/:id/assign-driver', auth, auth.isAdmin, async (req, res) => {
  try {
    const { driverId, driverName } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    order.driverId = driverId;
    order.driverName = driverName;
    order.status = 'assigned';
    order.assignedAt = new Date();
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;