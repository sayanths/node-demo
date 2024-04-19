const mongoose = require("mongoose")

const CartSchema = mongoose.Schema({
userId:{
    type:String,
    required : true
},
products:[
    {
      productId:{
        type:String,
      },
      quantity:{
        type:Number,
        default:1,
      },
      title:{
        type:String,
    },

    description:{
        type:String,
    },

    image:{
        type:String,
    },
    categories:{
        type:Array
    },
    size:{
        type:String,
    },
    color:{
        type:String,
    },
    price:{
        type:Number,
    },

    }
]
},{
    timestamps:true
})
module.exports = mongoose.model("cart",CartSchema)