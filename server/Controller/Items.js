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
 