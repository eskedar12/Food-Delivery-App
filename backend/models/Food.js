import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  restaurant: String,
  rating: { type: Number, default: 4.5 },
  prep_time: String,
  image: String,
  is_featured: { type: Boolean, default: false },
});

export default mongoose.model('Food', foodSchema);