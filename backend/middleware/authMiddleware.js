/*const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.split(" ")[1]; // ✅ get token after 'Bearer '
    
    console.log("Decoded user ID from token:", req.user);

    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // ✅ contains .id
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
}

module.exports = authenticateToken;*/
const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(" ")[1]; // ✅ Safely split

    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // ✅ should contain .id
        next();
    } catch (err) {
        console.error("Token verification failed:", err);
        res.status(400).json({ message: "Invalid Token" });
    }
}

module.exports = authenticateToken;
