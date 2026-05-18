import express from 'express';
import Food from '../models/Food.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;