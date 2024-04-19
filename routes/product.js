const Product = require("../models/productModel");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAuthorizationadmin } = require("./verifyToken");

const router = require("express").Router();

 
//Create

router.post("/", verifyTokenAndAuthorizationadmin, async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        const savedProduct = await newProduct.save(); // Use newProduct instead of Product
        res.status(200).json(savedProduct);
    } catch (error) {
        res.status(500).json(error);
    }
});


//update

router.put("/:id",verifyTokenAndAuthorizationadmin,async(req,res)=>{
    try {
        const  updatedProduct = await Product.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        res.status(200).json({
            status:"Sucess",
            message:"Product updated sucessfully"
        })
    } catch (error) {
        res.status(500).json(error) 
    }

}
)


// //Delete method

router.delete("/:id",verifyTokenAndAuthorizationadmin, async (req,res)=>{
try {
   await Product.findByIdAndDelete(req.params.id)
   res.status(200).json({
    status:"Sucess",
    message:"Product deleted Sucessfully"
   }) 
} catch (error) {
    res.status(500).json(error)
}
}
)


//Get one product 
router.get("/getProduct/:id", async (req, res) => {
    try {
        const foundProduct = await Product.findById(req.params.id);
        if (!foundProduct) {
            return res.status(404).json({ Product: "Product not found" });
        }
        res.status(200).json(foundProduct);
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get("/getAllProducts", async (req, res) => {
    try {
        const allProducts = await Product.find();
        if (!allProducts || allProducts.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }
        // Optionally, you can filter out certain fields from each product before sending the response
       
        res.status(200).json(allProducts);
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(500).json({ error: "Internal Server Error" });
    }
});





  module.exports = router;