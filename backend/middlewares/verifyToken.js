require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers["x-auth-token"];
    // console.log("Token received:", token);

    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    


    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log("Token verification error:", err);
            
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        // Attach decoded token to request object
        req.user = decoded;
        next();
    });
};

module.exports = verifyToken;