const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db"); // PostgreSQL connection
require("dotenv").config();

const router = express.Router();

// ✅ Middleware to Authenticate Admin
const authenticateAdmin = async (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Access Denied! No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded; // Attach admin details to request
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid Token!" });
    }
};

// ✅ Admin Registration Route
router.post("/register", async (req, res) => {
    const { fullName, email, password, adminKey } = req.body;

    try {
        if (!fullName || !email || !password || !adminKey) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (adminKey !== process.env.ADMIN_SECRET_KEY) {
            return res.status(403).json({ message: "Invalid Admin Key!" });
        }

        const adminExists = await pool.query("SELECT * FROM admins WHERE email = $1", [email]);
        if (adminExists.rows.length > 0) {
            return res.status(400).json({ message: "Admin already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            "INSERT INTO admins (name, email, password) VALUES ($1, $2, $3) RETURNING *",
            [fullName, email, hashedPassword]
        );

        res.status(201).json({ message: "Admin registered successfully!" });
    } catch (error) {
        console.error("Error in admin registration:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Admin Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await pool.query("SELECT * FROM admins WHERE email = $1", [email]);
        if (admin.rows.length === 0) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const validPassword = await bcrypt.compare(password, admin.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: admin.rows[0].id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token, message: "Admin login successful" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Protected Admin Dashboard Route
router.get("/dashboard", authenticateAdmin, async (req, res) => {
    try {
        const admin = await pool.query("SELECT id, name, email, created_at FROM admins WHERE id = $1", [req.admin.id]);

        if (admin.rows.length === 0) {
            return res.status(404).json({ message: "Admin not found!" });
        }

        res.json({ admin: admin.rows[0] });
    } catch (error) {
        console.error("Error in admin dashboard:", error);
        res.status(500).json({ message: "Server Error" });
    }
});


module.exports = router;
