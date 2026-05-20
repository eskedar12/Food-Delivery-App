import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Food from '../models/Food.js';
import Restaurant from '../models/Restaurant.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get dashboard statistics (Admin only)
router.get('/stats', auth, auth.isAdmin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalFoods = await Food.countDocuments();
    const totalRestaurants = await Restaurant.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.find({ createdAt: { $gte: today } });
    const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.grandTotal || 0), 0);
    
    const allOrders = await Order.find();
    const totalRevenue = allOrders.reduce((sum, order) => sum + (order.grandTotal || 0), 0);
    
    res.json({
      totalOrders,
      totalUsers,
      totalFoods,
      totalRestaurants,
      pendingOrders,
      todayRevenue,
      totalRevenue
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get sales report (Admin only)
router.get('/reports', auth, auth.isAdmin, async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    let startDate = new Date();
    
    if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (period === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }
    
    const orders = await Order.find({ createdAt: { $gte: startDate } });
    const totalRevenue = orders.reduce((sum, order) => sum + (order.grandTotal || 0), 0);
    const totalOrders = orders.length;
    
    res.json({
      period,
      totalRevenue,
      totalOrders,
      message: 'Report generated successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;