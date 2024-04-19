const router = require("express").Router();
const UserModel = require("../models/user")
const cryptojs = require("crypto-js")
const env = require("dotenv");
const jwt = require("jsonwebtoken");
const bodyParser = require('body-parser');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const otpGenerator = require("otp-generator");



//Register

// router.post("/register", async (req, res) => {
//     const newUser = new UserModel({
//         userName: req.body.userName,
//         email: req.body.email,
//         password: cryptojs.AES.encrypt(req.body.password,process.env.PASSWORD_SECRET).toString()
//     });
//     try {
//         const savedUser = await newUser.save();
//         res.status(201).json({ 
//             status: "success", 
//             message: "User successfully created", 
//           ///  data: savedUser 
//         });
//     } catch (error) {
//         res.status(500).json({ 
//             status: "error", 
//             message: "Failed to create user", 
//             error: error.message 
//         });
//         console.log("Error saving user to database:", error);
//     }
// });


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "jostinakkara12@gmail.com",
        pass: 'yjvf ugyn sqsu xgdw' 
    },
    });

  // Regular expression for validating email addresses
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  router.post('/sendotp', async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        // Validate input fields
        if (!userName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate email format
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Check if user with the same email already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Generate OTP
        const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });

        // Send OTP to the user's email
        await transporter.sendMail({
            from: 'jostinakkara12@gmail.com', // Your Gmail address
            to: email,
            subject: 'OTP Verification',
            text: `Your OTP for verification is: ${otp}`,
        });

        // Encrypt the password
        const encryptedPassword = cryptojs.AES.encrypt(password, process.env.PASSWORD_SECRET).toString();

        // Save the encrypted password to the database along with other user details
        const newUser = new UserModel({ userName, email, password: encryptedPassword, otp });
        await newUser.save();

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
});

    



// Endpoint to verify OTP
router.post('/verifyotp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Find the user by email
        let user = await UserModel.findOne({ email });

        // If user doesn't exist, create a new user with the email and OTP
        if (!user) {
            // Create a new user entry
            user = new UserModel({ email, otp });
            await user.save();
        }

        // Check if OTP matches
        if (user.otp !== otp) {
            console.log(user.otp)
            console.log(otp)
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Clear OTP from the database after successful verification
        user.otp = '';
        await user.save();

        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to verify OTP' });
    }
});






router.post("/login", async (req, res) => {
    try {
        // Find the user by username
        const loginUser = await UserModel.findOne({ email: req.body.email });

        // If user is not found, return 401 Unauthorized
        if (!loginUser) {
            return res.status(401).json({ message: "User not found" });
        }

        // Decrypt the password
        const decryptedPassword = cryptojs.AES.decrypt(
            loginUser.password, 
            process.env.PASSWORD_SECRET).toString(cryptojs.enc.Utf8);

        // Compare decrypted password with the provided password
        if (decryptedPassword !== req.body.password) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Generate JWT token
        const accessToken = jwt.sign({
            id: loginUser._id,
            isAdmin: loginUser.isAdmin
        },
        process.env.JWT_SECRETKEY, // Corrected typo from JWT_SECRETKEY.at to JWT_SECRETKEY
        {
            expiresIn: "3d"
        });

        // Passwords match, login successful
        res.status(200).json({
            status: "success",
            message: "Login successful",
            token: accessToken
        });
    } catch (error) {
        // Handle errors
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Function to generate a random OTP
function generateOTP(length = 6) {
    const characters = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    console.log(otp);
    return otp;
}

// Forgot password route
router.post('/forgotPassword', async (req, res) => {
    const { email } = req.body;
    try {
        // Find the user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate OTP
        const otp = generateOTP();

        // Save OTP to the user object
        user.otp = otp;
        await user.save();

        // Send OTP email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "jostinakkara12@gmail.com",
                pass: 'yjvf ugyn sqsu xgdw' 
            },
        });
        
        await transporter.sendMail({
            from: 'jostinakkara12@gmail.com',
            to: email,
            subject: 'Reset Your Password OTP',
            text: `Your reset OTP for verification is: ${otp}.`,
        });

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error during forgot password:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});





// Reset password route
router.put('/resetPassword', async (req, res) => {
    const {  otp, password } = req.body;

    try {
        // Find the user by email
        let user = await UserModel.findOne({ otp });

        // // Check if user doesn't exist
        // if (!user) {
        //     return res.status(404).json({ message: 'User not found' });
        // }

        // Check if OTP matches
        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Update user's password and clear OTP
        user.password = password;
        user.otp = '';
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to reset password' });
    }
});



module.exports = router;