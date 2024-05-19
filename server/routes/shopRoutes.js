const express = require('express');
const router = express.Router();
const ShopItem = require('../models/shopItem');

// Get all shop items
router.get('/items', async (req, res) => {
  try {
    const items = await ShopItem.find({});
    res.send(items);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
