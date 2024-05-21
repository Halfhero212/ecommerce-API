const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Ensure you handle passwords securely in your real app
  name: { type: String, required: true },
  cart: [{
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopItem' },
    quantity: { type: Number, default: 1 }
  }]
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
