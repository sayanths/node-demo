const exp = require("constants");
const express =require("express");
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const db = require("./config/db")
const auth = require("./routes/auth")
const user = require("./routes/user")
const product = require("./routes/product")
const cart = require("./routes/cart")
const order = require("./routes/order")
const bodyParser = require('body-parser');

dotenv.config()


app.use(express.json())
app.use(bodyParser.json());


app.use("/api/auth",auth);
app.use("/api/user",user);
app.use("/api/product",product);
app.use("/api/cart",cart);
app.use("/api/order",order);


const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


