const mangoose = require("mongoose")
const schema =new mangoose.schema({
    name: {
        type: String,
        required: true,
      },

      price: {
        type:String,
        required: true,
      },
      description:{
        type: String,
        require: true,

      },
      
      image: {
        type: String,
      },
      availableCount: {
        type: Number,
        required: true,
        
      },
      genre :{
        type: [String],
        required: true,
      },
});
module.exports = mangoose.model("shop-Item", schema);