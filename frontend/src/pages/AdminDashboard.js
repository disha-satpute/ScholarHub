import React, { useState } from "react";
import axios from "axios";
import "../styles/AdminDashboard.css";
import AddScholarship from "./AddScholarship"; // ✅ Import AddScholarship

const AdminDashboard = () => {
    const [scholarships, setScholarships] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);

    const fetchScholarships = () => {
        if (!searchKeyword.trim()) {
            alert("Enter a keyword"); // ✅ Show alert instead of setting error state
            return;
        }

        axios.get(`http://localhost:3000/api/scholarships?search=${searchKeyword}`)
            .then((res) => {
                console.log("API Response:", res.data);

                // ✅ Partial match instead of exact match
                const filteredResults = res.data.filter(scholarship => 
                    scholarship.title.toLowerCase().includes(searchKeyword.toLowerCase())
                );

                setScholarships(filteredResults);

                if (filteredResults.length === 0) {
                    alert("No scholarships found."); // ✅ Alert when no results are found
                }
            })
            .catch((err) => {
                console.error("Error fetching scholarships:", err);
                alert("Failed to fetch scholarships."); // ✅ Alert for API failure
            });
    };

    return (
        <div className="admin-dashboard">
            <h2>Scholarship Management</h2>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search Scholarships"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <button className="search-btn" onClick={fetchScholarships}>Search</button>
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
                            <button className="details-btn">See Details</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminDashboard;
