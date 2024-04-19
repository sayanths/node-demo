
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAuthorizationadmin } = require("./verifyToken");
const Cart = require("../models/cart");
const Product = require("../models/productModel");
const router = require("express").Router();




// Add Product to Cart
router.post("/addToCart/:id", verifyToken, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if the user has an existing cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            // If the user doesn't have a cart, create a new one
            cart = new Cart({ userId, products: [] });
        }

        // Check if the product is already in the cart
        const existingProductIndex = cart.products.findIndex(item => item.productId === productId);
        if (existingProductIndex !== -1) {
            // If the product already exists in the cart, show message
            return res.status(400).json({ message: "Product already added to cart" });
        } else {
            // If the product doesn't exist in the cart, add it as a new item
            cart.products.push({
                productId: product._id,
                quantity: 1,
                title: product.title,
                description: product.description,
                image: product.image,
                categories: product.categories,
                size: product.size,
                color: product.color,
                price: product.price
            });
        }

        // Save the updated cart
        await cart.save();

        res.status(201).json({
            status: "success",
            message: "Product added to cart",
            cart
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



// //Create

// router.post("/", verifyToken, async (req, res) => {
//     const newOrder = new Cart(req.body);
//     try {
//         const orderItem = await Order.save(); // Use newProduct instead of Product
//         res.status(200).json(orderItem);
//     } catch (error) {
//         res.status(500).json(error);
//     }
// });


//update

router.put("/:id",verifyTokenAndAuthorizationadmin,async(req,res)=>{
    try {
        const  updatedCartItem = await Cart.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        res.status(200).json(updatedCartItem)
    } catch (error) {
        res.status(500).json(error) 
    }

}
)


// //Delete method

router.delete("/:id",verifyTokenAndAuthorizationadmin, async (req,res)=>{
try {
   await Cart.findByIdAndDelete(req.params.id)
   res.status(200).json({
    status:"Sucess",
    message: req.params.title + "has been removed successfully "
   }) 
} catch (error) {
    res.status(500).json(error)
}
}
)


//Get one user order 
router.get("/find/:userId",verifyTokenAndAuthorization, async (req, res) => {
    try {
        const cart = await Cart.findOne({userId:req.params.userId});
        if (!cart) {
            return res.status(404).json({ cart: "Order not found" });
        }
        res.status(200).json(orders);
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get("/getAllOrders",verifyToken, async (req, res) => {
    try {
        const carts = await Cart.find();
        if (!carts || carts.length === 0) {
            return res.status(404).json({ message: "Cart is empty" });
        }
        // Optionally, you can filter out certain fields from each product before sending the response
       
        res.status(200).json(carts);
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(500).json({ error: "Internal Server Error" });
    }
});

  module.exports = router;