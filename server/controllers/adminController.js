const Admin = require('../models/Admin');
const ShopItem = require("../models/ShopItem");
const Order = require('../models/Order'); 
const Customer = require('../models/Customer'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require("express-validator");

// Admin signup
exports.createAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const newAdmin = new Admin({ name, email, password: hashedPassword });
    await newAdmin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering admin', error: error.message });
  }
};

// Admin signin
exports.adminSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Admin Sign In Request:", { email, password });

    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log("Admin not found");
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log("Stored Hashed Password:", admin.password);
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("Password Match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ message: "Admin signed in successfully", token });
  } catch (error) {
    res.status(500).json({ message: 'Error signing in', error: error.message });
  }
};

// Admin signout
exports.adminSignOut = (req, res) => {
  res.json({ message: 'Admin signed out successfully' });
};

// Create item
exports.createItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const newItem = new ShopItem(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

// Update item
exports.updateItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const update = await ShopItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!update) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(update);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while updating the item", error });
  }
};

// Delete item
exports.deleteItem = async (req, res) => {
  try {
    const item = await ShopItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while deleting the item", error });
  }
};

// Search item
exports.searchItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const results = await ShopItem.find({
      name: { $regex: new RegExp(req.query.name, 'i') }
    });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while searching items", error });
  }
};

// Fetch all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('customer').populate('items.item');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Fetch all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error: error.message });
  }
};
