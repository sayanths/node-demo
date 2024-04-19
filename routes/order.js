const Order = require("../models/order");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAuthorizationadmin } = require("./verifyToken");

const router = require("express").Router();



//Create

router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);
    try {
        const savedOrderItem = await newOrder.save(); // Use newProduct instead of Product
        res.status(200).json({
            message:"Added To cart Sucessfully"
        });
    } catch (error) {
        res.status(500).json(error);
    }
});


//update

router.put("/:id",verifyTokenAndAuthorizationadmin,async(req,res)=>{
    try {
        const  updatedOrderItem = await Order.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        res.status(200).json(updatedOrderItem)
    } catch (error) {
        res.status(500).json(error) 
    }

}
)


// //Delete method

router.delete("/:id",verifyTokenAndAuthorizationadmin, async (req,res)=>{
try {
   await Order.findByIdAndDelete(req.params.id)
   res.status(200).json({
    status:"Sucess",
    message: req.params.title + "has been removed successfully "
   }) 
} catch (error) {
    res.status(500).json(error)
}
}
)


//Get one product 
router.get("/find/:userId",verifyTokenAndAuthorization, async (req, res) => {
    try {
        const orderfoundProduct = await Order.findOne({userId:req.params.userId});
        if (!orderfoundProduct) {
            return res.status(404).json({ Order: "not found" });
        }
        res.status(200).json(orderfoundProduct);
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get("/getAllOrders",verifyTokenAndAuthorizationadmin, async (req, res) => {
    try {
        const OrderfoundProduct = await Order.find();
        if (!OrderfoundProduct || OrderfoundProduct.length === 0) {
            return res.status(404).json({ message: "Cart is empty" });
        }
        // Optionally, you can filter out certain fields from each product before sending the response
       
        res.status(200).json(OrderfoundProduct);
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(500).json({ error: "Internal Server Error" });
    }
});


  module.exports = router;