const express = require('express');
const { body, query } = require("express-validator");
const router = express.Router();
const CustomerController = require('../Controllers/CustomerController'); // Adjust the path according to your file structure

// Routes definitions using CustomerController
router.get("/items", 
  query("category").optional().isString().withMessage("Category must be a string"),
  query("minPrice").optional().isNumeric().withMessage("Minimum price must be a number"),
  query("maxPrice").optional().isNumeric().withMessage("Maximum price must be a number"),
  CustomerController.getItems 
);

router.get("/items/search",
  query("name").isString().withMessage("Name must be a string"),
  CustomerController.searchItems
);

router.get("/items/:id",
  CustomerController.getItemDetails
);

router.post("/cart", body("customerId").isMongoId().withMessage("Invalid Customer ID"), body("itemId").isMongoId().withMessage("Invalid item ID"), body("quantity").isInt({ min: 1 }).withMessage("Quantity must be greater than 0"), CustomerController.addToCart);

router.post("/checkout", body("customerId").isMongoId().withMessage("Invalid customer ID"), CustomerController.checkout);

module.exports = router;