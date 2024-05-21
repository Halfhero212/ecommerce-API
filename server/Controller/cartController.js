const ItemsModel = require("../models/shop-items");
const CustomerModel = require("../models/customer");
const OrderModel = require("../models/order");
const { validationResult } = require("express-validator");

// Controller for fetching items based on category and price range
exports.getItems = async(req, res)=>{
    if (!errors.isEmpty()){
        return res.status(400).jon({ errors: errors.array()});

    }
    const {category, minPrice, maxPeice}= req.query;
    const filter ={};
    if(category){
        filter.category = category;
    }
    if(minPrice){
        filter.price={ ...filter.price, $gte: minPrice};
    }
    if(maxPeice){
        filter.price={ ...filter.price, $lte: maxPeice};
    }
    try{
        const items = await ItemsModel.find(filter);
        res.status(200).json(items)
    }catch(error){
        console.log(error);
        res.status(500).json({message: "An error occurred while fetching items"});
    }
};

// Controller for searching items by name
exports.searchItems = async (req, res) => {
    const errors = validationResult(req); // Validate request
    if (!errors.isEmpty()) { // If errors exist, return them
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { name } = req.query; 
    try { 
      const items = await ItemsModel.find({
        name: { $regex: new RegExp(`^.*${name}.*`), $options: "i" }
      });
      res.status(200).json(items); 
    } catch (error) { 
      console.error(error);
      res.status(500).json({ message: "An error occurred while searching items" });
    }
  };

  // Controller for fetching details of a specific item
exports.getItemDetails = async (req, res) => {
    try { 
      const item = await ItemsModel.findById(req.params.id);
      if (!item) { 
        return res.status(404).json({ message: "Item not found" });
      }
      res.status(200).json(item); 
    } catch (error) { 
      console.error(error);
      res.status(500).json({ message: "An error occurred while fetching item details" });
    }
  };
  

  // Controller for adding an item to the customer's cart
exports.addToCart = async (req, res) => {
    const errors = validationResult(req); 
    if (!errors.isEmpty()) { 
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { customerId, itemId, quantity } = req.body; 
    try { 
      const customer = await CustomerModel.findById(customerId);
      if (!customer) { 
        return res.status(404).json({ message: "Customer not found" });
      }
  
      const item = await ItemsModel.findById(itemId);
      if (!item || item.availableCount < quantity) { 
        return res.status(400).json({ message: "Not enough items in stock" });
      }
  
      item.availableCount -= quantity; 
      await item.save();
  
      customer.cart.push({ item: itemId, quantity }); 
      await customer.save();
  
      res.status(200).json({ message: "Item added to cart" }); 
    } catch (error) { 
      console.error(error);
      res.status(500).json({ message: "An error occurred while adding item to cart" });
    }
  };
  
  // Controller for processing checkout
  exports.checkout = async (req, res) => {
    const errors = validationResult(req); 
    if (!errors.isEmpty()) { 
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { customerId } = req.body; 
    try { 
      const customer = await CustomerModel.findById(customerId).populate("cart.item");
      if (!customer) { 
        return res.status(404).json({ message: "Customer not found" });
      }
  
      if (customer.cart.length === 0) { 
        return res.status(400).json({ message: "Cart is empty" });
      }
  
      const orderItems = []; 
      let total = 0; 
  
      for (const cartItem of customer.cart) {  
        const item = cartItem.item;
        const quantity = cartItem.quantity;
        const price = item.price;
  
        orderItems.push({ item: item._id, quantity, price }); 
        total += price * quantity; 
      }
  
      const order = new OrderModel({ 
        customer: customerId,
        items: orderItems,
        total,
      });
  
      await order.save(); 
      customer.cart = [];  
      
      await customer.save(); 
      res.status(200).json(order); 
    } catch (error) { 
      console.error(error);
      res.status(500).json({ message: "An error occurred while processing checkout" });
    }
  };