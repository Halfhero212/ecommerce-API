const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopItem' },
    quantity: { type: Number, default: 1 }
  }],
  // Add fields for total cost if necessary
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
