const express = require('express');
const router = express.Router();
const ShopItem = require('../models/shopItem');

// Admin adding a new shop item
router.post('/items', async (req, res) => {
  try {
    const newItem = new ShopItem(req.body);
    await newItem.save();
    res.status(201).send(newItem);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Admin updating a shop item
router.put('/items/:id', async (req, res) => {
  try {
    const update = await ShopItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!update) {
      return res.status(404).send();
    }
    res.send(update);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
