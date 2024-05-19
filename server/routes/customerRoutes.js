const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');

// Customer signup
router.post('/signup', async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).send(customer);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Customer signin and other customer routes here

module.exports = router;
