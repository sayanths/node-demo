const stripe = require('stripe')(process.env.STRIP_APIKEY);
const Cart = require('../models/cart');
const Order = require('../models/order');

// Route for processing payments
router.post('/pay', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get the cart for the user
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Calculate the total amount to charge (sum of all product prices)
        const totalAmount = cart.products.reduce((total, product) => total + product.price * product.quantity, 0);

        // Create a payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount * 100, // amount in cents
            currency: 'usd', // or any other currency supported by Stripe
            metadata: { integration_check: 'accept_a_payment' },
        });

        // If paymentIntent is successfully created, return client_secret to the client
        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route for handling successful payment
router.post('/payment/success', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get the cart for the user
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Create a new order with the cart items
        const order = new Order({
            userId,
            products: cart.products,
            totalAmount: cart.products.reduce((total, product) => total + product.price * product.quantity, 0),
        });

        // Save the order to the database
        await order.save();

        // Clear the cart (remove all items from the cart)
        await Cart.findByIdAndUpdate(cart._id, { $set: { products: [] } });

        res.status(200).json({ message: 'Payment successful. Order placed successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
