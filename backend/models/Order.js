const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: String }, // For demo, just a string. Use ObjectId if you have user auth.
  items: [
    {
      name: String,
      quantity: Number,
      price: Number,
    }
  ],
  date: { type: String, required: true },
  status: { type: String, default: 'Processing' },
  orderId: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('Order', OrderSchema); 