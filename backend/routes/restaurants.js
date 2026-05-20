import express from 'express';
import Restaurant from '../models/Restaurant.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all restaurants (Public)
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ is_active: true });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single restaurant (Public)
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create restaurant (Admin only)
router.post('/', auth, auth.isAdmin, async (req, res) => {
  try {
    const { name, description, address, phone, email } = req.body;
    const restaurant = new Restaurant({ name, description, address, phone, email });
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update restaurant (Admin only)
router.put('/:id', auth, auth.isAdmin, async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete restaurant (Admin only)
router.delete('/:id', auth, auth.isAdmin, async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;