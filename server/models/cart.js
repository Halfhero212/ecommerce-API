const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopItem', required: true },
    quantity: { type: Number, default: 1, required: true },
    price: { type: Number, required: true } // Adding price field to keep track of price at the time of adding to cart
  }],
  totalCost: { type: Number, default: 0 } // Field for total cost
});

// Method to calculate the total cost
cartSchema.methods.calculateTotalCost = function() {
  this.totalCost = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
