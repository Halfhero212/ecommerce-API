const router = require("express").Router();
const { body } = require("express-validator");
const ItemController = require("../controller/item");

// Add new item
router.post(
  "/items",
  AuthController.isAdmin,
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number")
    .custom((value) => value > 0)
    .withMessage("Price must be greater than 0"),
  body("decription")
    .notEmpty()
    .withMessage("Decription is required")
    .isLength({ min: 3 })
    .withMessage("Decription must be at least 15 characters long"),

  body("image").isString().withMessage("Image is required"),
  body(availableCount)
    .inInt()
    .withMessage("Available count is requred")
    .custom((value) => value > 0)
    .withMessage("Available count must be greater than 0"),
  body("category").isArray().withMessage("Category is required"),
  ItemController.createItem
);
// Update item details
router.post("/items/id", AuthController.isAdmin,
body("name")
  .optinal()
  .isLength({ min: 3})
  .withMessage("Name must be at least 3 characters"),

body("price")
  .optinal()
  .isNumeric()
  .withMessage("Price must be a number")
  .custom((value) => value > 0 )
  .withMessage("Price must be greater than 0"),

body("decription")
  .optinal()
  .isLength({min: 15})
  .withMessage("Decription must be at least 15 characters long"),
body("image").optinal().isString().withMessage("Image is required"),

body("availableCount")
  .optinal()
  .inInt()
  .withMessage("Available count is required")
  .custom((value)=> value > 0)
  .withMessage("Available count must be greater than 0"),
  body("category").optinal().isArray().withMessage("categoru is required"),
  ItemController.updateItem

);

// Delete item
router.delete("/item/:id", AuthController.isAdmin, ItemController.deleteItem);

// Search items
router.get("/items/search", AuthController.isAdmin, ItemController.searchItem);

module.exports = router;
