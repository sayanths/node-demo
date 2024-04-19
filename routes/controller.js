

// const nodemailer = require("nodemailer");
// const otpGenerator = require("otp-generator");
// const mailgen = require("mailgen");
// const UserModel = require("../models/user");

// const transporter = nodemailer.createTransport({
    // service: "gmail",
    // auth: {
    //     user: "jostinakkara12@gmail.com",
    //     pass: 'yjvf ugyn sqsu xgdw' 
    // },
// });

// // Function to send OTP with expiration time
// const sendOTP = async (email) => {
//     try {
//         const otp = otpGenerator.generate(6, {
//             upperCaseAlphabets: false,
//             lowerCaseAlphabets: false,
//             specialChars: false,
//         });

//         // Calculate expiration time (e.g., 5 minutes from now)
//         const expirationTime = new Date();
//         expirationTime.setMinutes(expirationTime.getMinutes() + 5); // Adjust the duration as needed

//         const mailGenerator = new mailgen({
//             theme: "default",
//             product: {
//                 name: "Mailgen",
//                 link: "https://mailgen.js/",
//             },
//         });

//         const emailContent = {
//             body: {
//                 intro: "Your OTP is " + otp,
//             },
//         };

//         const emailTemplate = mailGenerator.generate(emailContent);

//         const message = {
//             from: "jostinakkara12@gmail.com",
//             to: email,
//             subject: "OTP for registration",
//             html: emailTemplate,
//         };

//         await transporter.sendMail(message);

//         // Return OTP and expiration time
//         return { otp, expirationTime };
//     } catch (error) {
//         console.error("Error sending OTP email:", error);
//         throw new Error("Failed to send OTP email");
//     }
// };

// const verifyOTP = async (inputOTP, email) => {
//     try {
//         // Find the user in the database
//         const user = await UserModel.findOne({ email: email });

//         // Check if user exists
//         if (!user) {
//             console.error("User not found.");
//             return false; // User not found
//         }

//         // Check if OTP is expired
//         if (user.expirationTime && user.expirationTime < new Date()) {
//             console.error("OTP expired.");
//             return false; // OTP expired
//         }

//         // Check if OTP matches
//         const isOTPValid = user.otp === inputOTP;
//         console.log("Is OTP valid?", isOTPValid); // Log the result of OTP comparison
//         return isOTPValid;
//     } catch (error) {
//         console.error("Error verifying OTP:", error);
//         return false;
//     }
// };



// // Function to handle signup request
// const signup = async (req, res) => {
//     try {
//         const { userName, email, password } = req.body;

//         // Validate email address (implement isValidEmail function)

//         // Send OTP
//         const { otp, expirationTime } = await sendOTP(email);

//         return res.status(200).json({ message: "OTP sent successfully" });
//     } catch (error) {
//         console.error("Error during signup:", error);
//         return res.status(500).json({ error: "Failed to signup" });
//     }
// };

// // Function to verify OTP and complete signup
// const verifyOtpAndSignup = async (req, res) => {
//     try {
//         const { email, otp } = req.body;

//         // Find the user in the database
//         let user = await UserModel.findOne({ email });

//         // If user doesn't exist, create a new user
//         if (!user) {
//             // Create a new user with email and set verified to false
//             user = new UserModel({ email, verified: true });
//             await user.save();
//         }

//         // Verify the OTP
//         const isOTPVerified = user && (user.otp === otp);

//         if (isOTPVerified) {
//             // Update user's verification status in the database
//             user.verified = true;
//             await user.save();

//             return res.status(200).json({ message: "OTP verified successfully" });
//         } else {
//             return res.status(400).json({ error: "Invalid OTP" });
//         }
//     } catch (error) {
//         console.error("Error verifying OTP:", error);
//         return res.status(500).json({ error: "Internal server error" });
//     }
// };



// module.exports = { signup, verifyOtpAndSignup };
