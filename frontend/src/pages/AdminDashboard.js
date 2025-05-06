import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/AdminDashboard.css";
import AddScholarship from "./AddScholarship";

const AdminDashboard = () => {
    const [scholarships, setScholarships] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);

    // Fetch all scholarships
    const fetchAllScholarships = () => {
        axios.get("http://localhost:3000/api/scholarships")
            .then((res) => {
                setScholarships(res.data);
            })
            .catch((err) => {
                console.error("Error fetching scholarships:", err);
                alert("Failed to fetch scholarships.");
            });
    };

    // Search scholarships
    const fetchScholarships = () => {
        if (!searchKeyword.trim()) {
            alert("Enter a keyword");
            return;
        }

        axios.get(`http://localhost:3000/api/scholarships?search=${searchKeyword}`)
            .then((res) => {
                const filteredResults = res.data.filter(s =>
                    s.title.toLowerCase().includes(searchKeyword.toLowerCase())
                );
                setScholarships(filteredResults);
                if (filteredResults.length === 0) {
                    alert("No scholarships found.");
                }
            })
            .catch((err) => {
                console.error("Error fetching scholarships:", err);
                alert("Failed to fetch scholarships.");
            });
    };

    // Delete scholarship
    const deleteScholarship = (id) => {
        if (window.confirm("Are you sure you want to delete this scholarship?")) {
            axios.delete(`http://localhost:3000/api/scholarships/${id}`)
                .then(() => {
                    setScholarships(prev => prev.filter(s => s.id !== id));
                    alert("Scholarship deleted successfully.");
                })
                .catch((err) => {
                    console.error("Error deleting scholarship:", err);
                    alert("Failed to delete scholarship.");
                });
        }
    };

    return (
        <div className="admin-dashboard">
              <button
                className="profile-btn"
                onClick={() => window.location.href = "/admin-profile"}
            >
                Admin Profile
            </button>
            <h3>Scholarship Management (add scholarships or search by keyword)</h3>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search Scholarships"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <button className="search-btn" onClick={fetchScholarships}>Search</button>
                <button className="all-btn" onClick={fetchAllScholarships}>See All Scholarships</button>
                <button className="add-btn" onClick={() => setShowAddForm(!showAddForm)}>+ Add Scholarship</button>
            </div>

            {showAddForm && <AddScholarship />}

            <ul className="scholarship-list">
                {scholarships.map((scholarship) => (
                    <li key={scholarship.id} className="scholarship-item">
                        <div className="scholarship-details">
                            <h4>{scholarship.title}</h4>
                            <p>{scholarship.description}</p>
                            <p><strong>Deadline:</strong> {new Date(scholarship.deadline).toISOString().split("T")[0]}</p>
                        </div>
                        <div className="admin-actions">
                            <Link to={`/scholarship-sdetails/${scholarship.id}`}>
                                <button className="details-btn">See Details</button>
                            </Link>
                            <Link to={`/update-scholarship/${scholarship.id}`}>
                                <button className="update-btn">Update</button>
                            </Link>
                            <button className="delete-btn" onClick={() => deleteScholarship(scholarship.id)}>
                                Remove
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminDashboard;

