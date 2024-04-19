const jwt = require("jsonwebtoken");

// Middleware creation
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRETKEY, (error, user) => {
            if (error) return res.status(403).json("Token is not valid");
            req.user = user; // Assuming your JWT payload contains user information
            next();
        });
    } else {
        return res.status(401).json("You are not authenticated");
    }
};

// Verifying the user is the same user or an admin
const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json({ message: "You are not allowed to do that!" });
        }
    });
};


// Verifying admin for order and product adding page
const verifyTokenAndAuthorizationadmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json({ message: "You are not allowed to do that!" });
        }
    });
};

module.exports = { verifyToken, verifyTokenAndAuthorization ,verifyTokenAndAuthorizationadmin};
