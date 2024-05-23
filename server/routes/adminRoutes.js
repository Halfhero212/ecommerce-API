
const express = require('express');
const { body, param, query } = require("express-validator");
const router = express.Router();
const adminController = require('../Controllers/adminController'); 
const authenticateToken = require('../middleware/authenticateToken');
const checkAdmin = require('../middleware/checkAdmin');

// Admin Signin
router.post('/signin', adminController.adminSignIn);

// Admin Signout
router.post('/signout', authenticateToken, adminController.adminSignOut);

// Create a new admin
router.post('/new-admin', authenticateToken, checkAdmin, 
  [
    body("name").isString().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 5 }).withMessage("Password must be at least 5 characters long")
  ], 
  adminController.createAdmin);

// Add a new item
router.post("/items", authenticateToken, checkAdmin,
  [
    body("name").isString().withMessage("Name is required"),
    body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
    body("description").isLength({ min: 5 }).withMessage("Description must be at least 5 characters long"),
    body("image").isString().withMessage("Image URL is required"),
    body("availableCount").isInt({ gt: 0 }).withMessage("Available count must be greater than 0"),
    body("category").isString().withMessage("Category is required")
  ],
  adminController.createItem
);

// Update an existing item
router.put("/items/:id", authenticateToken, checkAdmin,
  [
    param("id").isMongoId().withMessage("Invalid item ID"),
    body("name").optional().isString(),
    body("price").optional().isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
    body("description").optional().isLength({ min: 5 }),
    body("image").optional().isString(),
    body("availableCount").optional().isInt({ gt: 0 }),
    body("category").optional().isString()
  ],
  adminController.updateItem
);

// Delete an item
router.delete("/items/:id", authenticateToken, checkAdmin,
  param("id").isMongoId().withMessage("Invalid item ID"),
  adminController.deleteItem
);

// Search for items by name
router.get("/items/search", authenticateToken, checkAdmin,
  query("name").isString().withMessage("Name query is required"),
  adminController.searchItem
);
router.get("/items/:id", authenticateToken, checkAdmin,
  param("id").isMongoId().withMessage("Invalid item ID"),
  adminController.getItemDetails
);

router.get("/orders", authenticateToken, checkAdmin, adminController.getAllOrders);

// Fetch all customers
router.get("/customers", authenticateToken, checkAdmin, adminController.getAllCustomers);


module.exports = router;
