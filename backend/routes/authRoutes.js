const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const authMiddleware = require("../middleware/authMiddleware");
const pool = require('../config/db'); // PostgreSQL database connection
require('dotenv').config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendEmail(to, subject, resetLink) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASS  // Your app password
        }
    });

    const mailOptions = {
        from: `"ScholarHub" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: subject,
        html: `
            <div style="font-family: Arial, sans-serif; text-align: center;">
                <h2 style="color: #2C3E50;">Password Reset Request</h2>
                <p>You requested to reset your password. Click the button below to reset it:</p>
                <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
                <p>If you did not request this, please ignore this email.</p>
                <p>Thanks,<br/>ScholarHub Team</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Reset password email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

// REGISTER Route
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user
        const newUser = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
            [name, email, hashedPassword]
        );

        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
});
// LOGIN Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.rows[0].id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token, message: "Login successful" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
});
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        // Check if user exists
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate Reset Token (valid for 15 minutes)
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "15m" });

        // Store token in database
        await pool.query("UPDATE users SET reset_token = $1 WHERE email = $2", [token, email]);

        // Ensure FRONTEND_URL is set
        if (!process.env.FRONTEND_URL) {
            console.error("FRONTEND_URL is not defined in environment variables");
            return res.status(500).json({ message: "Server Error: FRONTEND_URL not set" });
        }

        // Generate Reset Link
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
        console.log("Generated Reset Link:", resetLink); // ✅ Logging after defining resetLink

        // Send email with reset link
        await sendEmail(email, "Password Reset", `Click here to reset your password: ${resetLink}`);

        res.status(200).json({ message: "Reset link sent to email" });

    } catch (error) {
        console.error("Error in forgot-password route:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params; // Corrected: Get token from params
    const { newPassword } = req.body;
   
    try {
        // Find user with the given reset token
        const user = await pool.query("SELECT * FROM users WHERE reset_token = $1", [token]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        const email = user.rows[0].email;

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password and clear reset token
        await pool.query("UPDATE users SET password = $1, reset_token = NULL WHERE email = $2", [hashedPassword, email]);

        res.status(200).json({ message: "Password reset successful!" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Invalid or expired token" });
    }
});


// ✅ GET User Profile
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, name, email FROM users WHERE id = $1",
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// ✅ Update Name
router.put("/update-name", authMiddleware, async (req, res) => {
    try {
        const { newName } = req.body;

        if (!newName || newName.trim() === "") {
            return res.status(400).json({ message: "Name is required" });
        }

        const result = await pool.query(
            "UPDATE users SET name = $1 WHERE id = $2 RETURNING name",
            [newName.trim(), req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Name updated successfully", name: result.rows[0].name });
    } catch (error) {
        console.error("Error updating name:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ Update Email
router.put("/update-email", authMiddleware, async (req, res) => {
    try {
        const { newEmail } = req.body;

        if (!newEmail || newEmail.trim() === "") {
            return res.status(400).json({ message: "Email is required" });
        }

        const result = await pool.query(
            "UPDATE users SET email = $1 WHERE id = $2 RETURNING email",
            [newEmail.trim(), req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Email updated successfully", email: result.rows[0].email });
    } catch (error) {
        console.error("Error updating email:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ Change Password
router.put("/change-password", authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Both current and new password are required" });
        }

        // Get user from DB
        const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [req.user.id]);
        const user = userResult.rows[0];

        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, req.user.id]);

        res.json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Logout (handled on frontend by clearing token)
router.post("/logout", (req, res) => {
    res.json({ message: "Logged out successfully" });
});
// Route: POST /api/user/save-scholarship
router.post("/save-scholarship", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { scholarshipId } = req.body;

        const existing = await pool.query(
            "SELECT * FROM user_saved_scholarships WHERE user_id = $1 AND scholarship_id = $2",
            [userId, scholarshipId]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ message: "Scholarship already saved" });
        }

        await pool.query(
            "INSERT INTO user_saved_scholarships (user_id, scholarship_id) VALUES ($1, $2)",
            [userId, scholarshipId]
        );

        res.status(200).json({ message: "Scholarship saved successfully" });
    } catch (err) {
        console.error("Error saving scholarship:", err);
        res.status(500).json({ message: "Server error" });
    }
});
// DELETE /api/scholarships/saved/:scholarship_id
router.delete("/saved/:scholarship_id", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { scholarship_id } = req.params;

        await pool.query(
            "DELETE FROM user_saved_scholarships WHERE user_id = $1 AND scholarship_id = $2",
            [userId, scholarship_id]
        );

        res.json({ message: "Scholarship unsaved successfully" });
    } catch (error) {
        console.error("Error unsaving scholarship:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// GET /api/scholarships/saved
router.get("/saved", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT s.* FROM scholarships s
             JOIN user_saved_scholarships uss ON s.id = uss.scholarship_id
             WHERE uss.user_id = $1`,
            [req.user.id]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching saved scholarships:", error);
        res.status(500).json({ message: "Server error" });
    }
});



module.exports = router;
