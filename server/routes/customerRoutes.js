const express = require('express');
const { body, query } = require("express-validator");
const router = express.Router();
const Customer = require('../models/customer');

// Get all items with optional filters
router.get("/items", 
query("category").optinal().isString().withMessage("category must be String"),
query("minPrice").optinal(). isNumeric(). withMessage("Minimum price must be number"),
query("maxPrice").optinal(). isNumeric(). withMessage("Maximum price must be number"),
CustomerController.getItems 
);

// search items
router.get("/items/search",
query("name"). isString(). withMessage("name must be String"),
CustomerController.searchItems
);
// get single item Details
router.get("/items/:id",
  CustomerController.getItemsDetails
);
// add item to cart
router.post("/cart",
  body("customerId").isMongoId().withMessage("Invalid Customer ID"),
  body("itemId").isMongoId().withMessage("Invalid item ID"),
  body("quantity").inInt({min: 1}).withMessage("Quantity must be greater than 0"),
  CustomerController.addToCart
);
// checkout 
router.post("/checkout",
  body("customerId").isMongoId().withMessage("Invalid customer ID"),
  CustomerController.checkout
);
// Customer signup
// router.post('/signup', async (req, res) => {
//   try {
//     const customer = new Customer(req.body);
//     await customer.save();
//     res.status(201).send(customer);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// Customer signin and other customer routes here

module.exports = router;
