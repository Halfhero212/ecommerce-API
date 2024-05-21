const ShopItem = require("../models/ShopItem");
const Customer = require("../models/Customer");
const Order = require("../models/Order");

// Controller for fetching items with optional filters for category and price range
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

// Controller for searching items by name
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

// Controller for fetching details of a specific item
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

// Controller for adding an item to a customer's cart
exports.addToCart = async (req, res) => {
    const { customerId, itemId, quantity } = req.body;
    try {
        const item = await ShopItem.findById(itemId);
        if (!item) return res.status(404).json({ message: "Item not found" });
        if (item.availableCount < quantity) return res.status(400).json({ message: "Not enough items in stock" });

        item.availableCount -= quantity;
        await item.save();

        const customer = await Customer.findById(customerId);
        if (!customer) return res.status(404).json({ message: "Customer not found" });

        // Check if item already in cart and increase quantity
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
    const { customerId } = req.body;
    try {
        const customer = await Customer.findById(customerId).populate({
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
            customer: customerId,
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
