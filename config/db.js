const mongoose = require('mongoose');
require('dotenv').config(); 

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL,
         
            ).then(()=>console.log("db connected successfully")).catch(()=>console.log("db not connected"))
        
    } catch (error) {
        console.error("db connection error:", error);
        process.exit(1);
    }
};



module.exports= connectDb();