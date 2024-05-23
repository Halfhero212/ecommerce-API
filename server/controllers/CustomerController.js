
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const ShopItem = require('../models/shopItem');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require("express-validator");

// Customer signup
exports.customerSignUp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const newCustomer = new Customer({ name, email, password: hashedPassword });
    await newCustomer.save();
    res.status(201).json({ message: 'Customer registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering customer', error: error.message });
  }
};

// Customer signin
exports.customerSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: customer._id, role: 'customer' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ message: "Customer signed in successfully", token });
  } catch (error) {
    res.status(500).json({ message: 'Error signing in', error: error.message });
  }
};

// Customer signout

exports.customerSignOut = (req, res) => {
  res.json({ message: 'Customer signed out successfully' });
};

// Fetch customer orders
exports.getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Update customer profile
exports.updateCustomerProfile = async (req, res) => {
  try {
    const updates = req.body;
    const customer = await Customer.findByIdAndUpdate(req.user.id, updates, { new: true });
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// Get items with optional filters for category and price range
exports.getItems = async (req, res) => {
  try {
    const filters = {};
    if (req.query.category) {
      filters.category = req.query.category;
    }
    if (req.query.minPrice) {
      filters.price = { $gte: parseFloat(req.query.minPrice) };
    }
    if (req.query.maxPrice) {
      filters.price = { $lte: parseFloat(req.query.maxPrice) };
    }
    const items = await ShopItem.find(filters);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching items", error });
  }
};

// Search items by name
exports.searchItems = async (req, res) => {
  try {
    const items = await ShopItem.find({
      name: { $regex: new RegExp(req.query.name, 'i') }
    });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error searching items", error });
  }
};

// Fetch details of a specific item
exports.getItemDetails = async (req, res) => {
  try {
    const item = await ShopItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Error fetching item details", error });
  }
};

// Add an item to the customer's cart
// Add an item to the customer's cart
exports.addToCart = async (req, res) => {
  const { itemId, quantity } = req.body;

  try {
    const item = await ShopItem.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.availableCount < quantity) return res.status(400).json({ message: "Not enough items in stock" });

    item.availableCount -= quantity;
    await item.save();

    const customer = await Customer.findById(req.user.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    const cartItemIndex = customer.cart.findIndex(ci => ci.item.toString() === itemId);
    if (cartItemIndex > -1) {
      customer.cart[cartItemIndex].quantity += quantity;
    } else {
      customer.cart.push({ item: itemId, quantity });
    }
    await customer.save();

    res.status(200).json({ message: "Item added to cart successfully" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while adding item to cart", error });
  }
};

// Checkout
exports.checkout = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id).populate({
      path: 'cart.item',
      model: 'ShopItem'
    });
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    if (customer.cart.length === 0) return res.status(400).json({ message: "Cart is empty" });

    const orderItems = customer.cart.map(cartItem => ({
      item: cartItem.item._id,
      quantity: cartItem.quantity,
      price: cartItem.item.price,
      subtotal: cartItem.quantity * cartItem.item.price
    }));
    const total = orderItems.reduce((acc, curr) => acc + curr.subtotal, 0);

    // Create a new order
    const order = new Order({
      customer: req.user.id,
      items: orderItems,
      total
    });
    await order.save();

    // Clear the cart and update customer
    customer.cart = [];
    await customer.save();

    res.status(200).json({ order, message: "Checkout successful" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while processing checkout", error });
  }
};
