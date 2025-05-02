import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AdminLogin.css";

const AdminLogin = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:3000/api/admin/login", formData);
            localStorage.setItem("adminToken", res.data.token);
            alert("Admin Login Successful!");
            navigate("/admin-dashboard");
        } catch (error) {
            alert("Invalid Admin Credentials.");
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-box">
                <h2 className="admin-login-title">Admin Login</h2>
                <form onSubmit={handleSubmit} className="admin-login-form">
                    <input
                        type="email"
                        name="email"
                        className="admin-login-input"
                        placeholder="Admin Email"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        className="admin-login-input"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="admin-login-button">Login</button>
                </form>
                <div className="admin-login-footer">
                    <a href="/forgot-password">Forgot Password?</a>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
