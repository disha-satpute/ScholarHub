import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Adminprofile.css";

const AdminProfile = () => {
    const [admin, setAdmin] = useState(null);
    const [updateType, setUpdateType] = useState("");
    const [newValue, setNewValue] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [message, setMessage] = useState("");
    const [userList, setUserList] = useState([]);

    // Auto-dismiss message after 3 seconds
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    // Fetch admin profile
    useEffect(() => {
        const fetchAdminProfile = async () => {
            const token = localStorage.getItem("adminToken");
            if (!token) {
                setMessage("No token found");
                return;
            }

            try {
                const res = await axios.get("http://localhost:3000/api/admin/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAdmin(res.data.admin);
            } catch (error) {
                console.error("Error fetching admin details", error.response || error);
                setMessage(error.response?.data?.message || "Failed to load admin profile");
            }
        };

        fetchAdminProfile();
    }, []);

    // Fetch list of users (for admin)
    useEffect(() => {
        const fetchUserList = async () => {
            const token = localStorage.getItem("adminToken");
            if (!token) {
                setMessage("No token found");
                return;
            }

            try {
                const res = await axios.get("http://localhost:3000/api/admin/users", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserList(res.data);
            } catch (error) {
                console.error("Error fetching users", error.response || error);
                setMessage(error.response?.data?.message || "Failed to load users");
            }
        };

        fetchUserList();
    }, []);

    // Handle update logic
    const handleUpdate = async () => {
        let endpoint = "";
        let data = {};

        if (updateType === "name") {
            endpoint = "/update-name";
            data = { newName: newValue.trim() };
        } else if (updateType === "email") {
            endpoint = "/update-email";
            data = { newEmail: newValue.trim() };
        } else if (updateType === "password") {
            endpoint = "/update-password";
            data = { currentPassword, newPassword: newValue.trim() };
        }

        if (!newValue.trim()) {
            setMessage("Please enter a value to update.");
            return;
        }

        try {
            const res = await axios.put(`http://localhost:3000/api/admin${endpoint}`, data, {
                headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
            });

            setMessage(res.data.message);

            if (updateType === "name") setAdmin(prev => ({ ...prev, name: res.data.name }));
            if (updateType === "email") setAdmin(prev => ({ ...prev, email: res.data.email }));

            setNewValue("");
            setCurrentPassword("");
            setUpdateType("");
        } catch (error) {
            console.error("Update failed", error);
            setMessage("Update failed. Please try again.");
        }
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        window.location.href = "/login";
    };

    return (
        <div className="admin-profile-container">
            <h3>Admin Profile</h3>

            <div className="profile-header">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    alt="avatar"
                    className="profile-avatar"
                />
                <div>
                    {admin ? (
                        <>
                            <p><strong>Name:</strong> {admin.name}</p>
                            <p><strong>Email:</strong> {admin.email}</p>
                        </>
                    ) : (
                        <p>{message || "Loading..."}</p>
                    )}
                </div>
            </div>

            <h3>Edit Admin Information</h3>
            <div className="update-options">
                <button onClick={() => setUpdateType("name")}>📝 Update Name</button>
                <button onClick={() => setUpdateType("email")}>📧 Update Email</button>
                <button onClick={() => setUpdateType("password")}>🔒 Change Password</button>
            </div>

            {updateType && (
                <div className="form-group">
                    {updateType === "password" && (
                        <input
                            type="password"
                            placeholder="Current Password"
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    )}
                    <input
                        type={updateType === "password" ? "password" : "text"}
                        placeholder={`Enter new ${updateType}`}
                        onChange={(e) => setNewValue(e.target.value)}
                    />
                    <button onClick={handleUpdate}>Save Changes</button>
                </div>
            )}

            {message && <p className="message">{message}</p>}

            <h3>👥 Registered Users</h3>
            <ul className="user-list">
                {userList.length > 0 ? (
                    userList.map(u => (
                        <li key={u.id}>
                            <div>
                                <strong>{u.name}</strong><br />
                                <span>{u.email}</span>
                            </div>
                        </li>
                    ))
                ) : (
                    <li>No users found.</li>
                )}
            </ul>

            <div className="profile-buttons">
                <Link to="/admin-dashboard"><button className="dash">Go to Dashboard</button></Link>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
        </div>
    );
};

export default AdminProfile;
