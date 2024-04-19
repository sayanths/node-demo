const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        userName :{
           type: String,
            unique:true
        },
        email :{
            type: String,
             unique:true
         },
        password:{
            type:String,
            unique:true
        },
        otp: { // Add this field to store OTP
            type: String
        },
        verified:{
            type:Boolean,
            default:true
        },
        isAdmin:{
            type:Boolean,
            default:false
        },
        
    },{
        timestamps:true
    }
)

module.exports = mongoose.model("user",UserSchema);