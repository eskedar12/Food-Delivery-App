import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    foodId: { type: String, required: true },
    name: String,
    price: Number,
    quantity: Number,
    restaurant: String,
  }],
  totalAmount: { type: Number, required: true },
  deliveryFee: { type: Number, default: 50 },
  grandTotal: { type: Number, required: true },
  deliveryDetails: {
    phone: String,
    address: String,
    notes: String,
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'preparing', 'picked_up', 'out_for_delivery', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  paymentMethod: { type: String, enum: ['cash', 'telebirr', 'awash'], default: 'cash' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  // Driver fields
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  driverName: { type: String, default: '' },
  assignedAt: Date,
  pickedUpAt: Date,
  deliveredAt: Date,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Order', orderSchema);