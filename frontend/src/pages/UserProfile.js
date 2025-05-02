import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/UserProfile.css";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [updateType, setUpdateType] = useState("");
    const [newValue, setNewValue] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [message, setMessage] = useState("");
    const [savedScholarships, setSavedScholarships] = useState([]);

    // ✅ Auto-dismiss message after 3 seconds
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    // ✅ Fetch user profile
    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem("userToken");
            if (!token) {
                setMessage("No token found");
                return;
            }

            try {
                const res = await axios.get("http://localhost:3000/api/auth/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(res.data);
            } catch (error) {
                console.error("Error fetching user details", error);
                setMessage("Failed to load user profile");
            }
        };

        fetchUserProfile();
    }, []);

    // ✅ Fetch saved scholarships
    useEffect(() => {
        const fetchSavedScholarships = async () => {
            try {
                const token = localStorage.getItem("userToken");
                if (!token || !user?.id) return;

                const res = await axios.get(`http://localhost:3000/api/scholarships/saved/${user.id}`);
                setSavedScholarships(res.data);
            } catch (error) {
                console.error("Failed to load saved scholarships", error);
            }
        };

        if (user?.id) {
            fetchSavedScholarships();
        }
    }, [user]);

    // ✅ Handle update logic
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
            endpoint = "/change-password";
            data = { currentPassword, newPassword: newValue.trim() };
        }

        if (!newValue.trim()) {
            setMessage("Please enter a value to update.");
            return;
        }

        try {
            const res = await axios.put(`http://localhost:3000/api/auth${endpoint}`, data, {
                headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
            });

            setMessage(res.data.message);

            if (updateType === "name") setUser(prev => ({ ...prev, name: res.data.name }));
            if (updateType === "email") setUser(prev => ({ ...prev, email: res.data.email }));

            setNewValue("");
            setCurrentPassword("");
            setUpdateType("");
        } catch (error) {
            console.error("Update failed", error);
            setMessage("Update failed. Please try again.");
        }
    };

    // ✅ Handle unsave
    const handleUnsaveScholarship = async (scholarshipId) => {
        try {
            const res = await axios.delete(`http://localhost:3000/api/scholarships/saved/${user.id}/${scholarshipId}`);
            setSavedScholarships(prev => prev.filter(s => s.id !== scholarshipId));
            setMessage("Scholarship removed from saved list.");
        } catch (error) {
            console.error("Error unsaving scholarship:", error);
            setMessage("Failed to unsave scholarship.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("userToken");
        window.location.href = "/login";
    };

    return (
        <div className="profile-container">
            <h3>User Profile</h3>

            <div className="profile-header">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    alt="avatar"
                    className="profile-avatar"
                />
                <div>
                    {user ? (
                        <>
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                        </>
                    ) : (
                        <p>{message || "Loading..."}</p>
                    )}
                </div>
            </div>

            <h3>Edit Your Information</h3>
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

            <h3>🎓 Saved Scholarships</h3>
            <ul className="saved-scholarship-list">
    {savedScholarships.length > 0 ? (
        savedScholarships.map(s => (
            <li key={s.id}>
    <div>
        <strong>{s.title}</strong><br />
        <span>{s.description}</span>
    </div>
    <div className="saved-scholarship-actions">
    <Link to={`/scholarship-details/${s.id}`}>
    <button className="details-btn">See Details</button>
</Link>

        <button onClick={() => handleUnsaveScholarship(s.id)} className="remove-btn">
            Remove
        </button>
    </div>
</li>

        ))
    ) : (
        <li>No scholarships saved yet.</li>
    )}
</ul>


            <div className="profile-buttons">
                <Link to="/user-dashboard"><button className="dash">Go to Dashboard</button></Link>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
        </div>
    );
};

export default UserProfile;
