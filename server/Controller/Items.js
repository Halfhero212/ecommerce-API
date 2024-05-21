const { response } = require("express");
const ItemsModel = require("../models/shop-Item");
const { validationResult} = require("express-validator");

//createItem Function
 exports.createItem = async(req, res) =>{

    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }
      const {name, price, decription, image, availableCount, category} =req.body;

      try{
        const item = new ItemsModel({
            name, price, decription, image, availableCount, category,
        });
         
        item.save().then((response) => res.status(201).json(response));
      }
      catch(errors){
        console.log(error);
        res.status(500).json({message: "Something went wrong"});
      }
    };
    //updateItem Function
    exports.updateItem = async(req, res) =>{
         
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array()});

        }
           try{
            const itemId = req.params.id;
            const newItem = await ItemsModel.findByIdAndUpdate(itemId, req.body, {
                new:true,
            });
            res.status(200).json(newItem);
           }
           catch (error){
           console.log(error);
           res.status(500).json({message: "An error occurred while updating the item on the server."})
           }
    };
    //deleteItem Function
    exports.deleteItem = async (req, res) => {
        const itemId = req.params.id;
      
        try {
          const item = await ItemsModel.findByIdAndDelete(itemId);
          if (!item) {
            return res.status(400).json({ message: "Item not found" });
          }
          res.status(200).json({ message: "Item deleted successfully" });
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: "An error occurred while deleting the item on the server." });
        }
      };


      //searchItem Function
      exports.searchItem = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
      
        try {
          const { name } = req.query;
      
          const results = await ItemsModel.find({
            name: { $regex: new RegExp(`^.*${name}.*`), $options: "i" },
          });
      
          res.status(200).json(results);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "An error occurred while searching the item on the server" });
        }
      };
      

      

 