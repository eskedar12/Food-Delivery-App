import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: Array,
  totalAmount: Number,
  deliveryFee: { type: Number, default: 50 },
  grandTotal: Number,
  deliveryDetails: {
    phone: String,
    address: String,
    notes: String,
  },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Order', orderSchema);