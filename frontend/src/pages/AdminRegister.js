import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AdminRegister.css";

const AdminRegister = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        adminKey: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:3000/api/admin/register", formData);

            if (res.status === 201) {
                alert("Admin Registered Successfully!");
                navigate("/admin-login");
            } else {
                alert(res.data.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            if (error.response) {
                alert(error.response.data.message || "Registration failed. Please try again.");
            } else {
                alert("Server error. Please try again later.");
            }
        }
    };

    return (
        <div className="admin-register-container">
            <div className="admin-register-box">
                <h2 className="admin-register-title">Admin Registration</h2>
                <form onSubmit={handleSubmit} className="admin-register-form">
                    <input
                        type="text"
                        name="fullName"
                        className="admin-register-input"
                        placeholder="Full Name"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        className="admin-register-input"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        className="admin-register-input"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="adminKey"
                        className="admin-register-input"
                        placeholder="Admin Key"
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="admin-register-button">Register</button>
                </form>
                <div className="admin-register-footer">
                    Already have an account? <a href="/admin-login">Login</a>
                </div>
            </div>
        </div>
    );
};

export default AdminRegister;
