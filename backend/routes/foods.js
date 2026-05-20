import express from 'express';
import Food from '../models/Food.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Get all foods
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single food
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json(food);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create food with image upload (admin only)
router.post('/', auth, auth.isAdmin, upload.single('image'), async (req, res) => {
  try {
    const foodData = JSON.parse(req.body.data);
    
    if (req.file) {
      foodData.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }
    
    const food = new Food(foodData);
    await food.save();
    res.status(201).json(food);
  } catch (error) {
    console.error('Error creating food:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update food (admin only)
router.put('/:id', auth, auth.isAdmin, upload.single('image'), async (req, res) => {
  try {
    const updateData = req.body;
    
    if (req.file) {
      updateData.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }
    
    const food = await Food.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json(food);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete food (admin only)
router.delete('/:id', auth, auth.isAdmin, async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json({ message: 'Food deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;