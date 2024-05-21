const ShopItem = require("../models/ShopItem");
const { validationResult } = require("express-validator");

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
