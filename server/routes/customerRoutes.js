// routes/customerRoutes.js
const express = require('express');
const { body, query, param } = require("express-validator");
const router = express.Router();
const customerController = require('../controllers/customerController');
const authenticateToken = require('../middleware/authenticateToken');

// Customer Signup
router.post('/signup',
  [
    body("name").isString().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 5 }).withMessage("Password must be at least 5 characters long")
  ],
  customerController.customerSignUp
);

// Customer Signin
router.post('/signin', customerController.customerSignIn);

// Customer Signout
router.post('/signout', authenticateToken, customerController.customerSignOut);

// Fetch customer orders
router.get('/orders', authenticateToken, customerController.getCustomerOrders);

// Update customer profile
router.put('/profile', authenticateToken, customerController.updateCustomerProfile);

// Fetch items with optional filters
router.get("/items", 
  query("category").optional().isString().withMessage("Category must be a string"),
  query("minPrice").optional().isNumeric().withMessage("Minimum price must be a number"),
  query("maxPrice").optional().isNumeric().withMessage("Maximum price must be a number"),
  customerController.getItems
);

// Search items by name
router.get("/items/search",
  query("name").isString().withMessage("Name must be a string"),
  customerController.searchItems
);

// Fetch details of a specific item
router.get("/items/:id",
  param("id").isMongoId().withMessage("Invalid item ID"),
  customerController.getItemDetails
);

// Add an item to the customer's cart
router.post("/cart", 
  [
    authenticateToken,
    body("itemId").isMongoId().withMessage("Invalid item ID"),
    body("quantity").isInt({ min: 1 }).withMessage("Quantity must be greater than 0")
  ],
  customerController.addToCart
);

// Checkout
router.post("/checkout", authenticateToken, customerController.checkout);

module.exports = router;
