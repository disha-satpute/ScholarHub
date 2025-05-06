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
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
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

        console.log('Generated Token:', token);  // Log the token for debugging

        res.json({ token, message: "Admin login successful" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
});

// Fetch Admin Profile (Use the correct endpoint `/api/admin/profile` or similar)
router.get("/profile", authenticateAdmin, async (req, res) => {
    try {
        const admin = await pool.query("SELECT id, name, email, created_at FROM admins WHERE id = $1", [req.admin.id]);

        if (admin.rows.length === 0) {
            return res.status(404).json({ message: "Admin not found!" });
        }

        res.json({ admin: admin.rows[0] });
    } catch (error) {
        console.error("Error in admin profile:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Get all users (if needed for your list)
router.get("/users", authenticateAdmin, async (req, res) => {
    try {
        const users = await pool.query("SELECT id, name, email FROM users");
        res.json(users.rows);
    } catch (error) {
        console.error("Error fetching users:", error);
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

// ✅ Update Admin Name
router.put("/update-name", authenticateAdmin, async (req, res) => {
    try {
        const { newName } = req.body;

        if (!newName || newName.trim() === "") {
            return res.status(400).json({ message: "Name is required" });
        }

        const result = await pool.query(
            "UPDATE admins SET name = $1 WHERE id = $2 RETURNING name",
            [newName.trim(), req.admin.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.json({ message: "Name updated successfully", name: result.rows[0].name });
    } catch (error) {
        console.error("Error updating name:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ Update Admin Email
router.put("/update-email", authenticateAdmin, async (req, res) => {
    try {
        const { newEmail } = req.body;

        if (!newEmail || newEmail.trim() === "") {
            return res.status(400).json({ message: "Email is required" });
        }

        const result = await pool.query(
            "UPDATE admins SET email = $1 WHERE id = $2 RETURNING email",
            [newEmail.trim(), req.admin.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.json({ message: "Email updated successfully", email: result.rows[0].email });
    } catch (error) {
        console.error("Error updating email:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ Update Admin Password
router.put("/update-password", authenticateAdmin, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Both current and new password are required" });
        }

        // Get admin from DB
        const adminResult = await pool.query("SELECT * FROM admins WHERE id = $1", [req.admin.id]);
        const admin = adminResult.rows[0];

        if (!admin) return res.status(404).json({ message: "Admin not found" });

        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query("UPDATE admins SET password = $1 WHERE id = $2", [hashedPassword, req.admin.id]);

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ Admin Logout
router.post("/logout", authenticateAdmin, (req, res) => {
    res.json({ message: "Admin logged out successfully" });
});

module.exports = router;
