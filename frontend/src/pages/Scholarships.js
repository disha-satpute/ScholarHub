import React, { useState } from "react";
import axios from "axios";
import "../styles/Scholarships.css";

const Scholarships = () => {
    const [scholarships, setScholarships] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchClicked, setSearchClicked] = useState(false); // Track if search was clicked

    const fetchScholarships = () => {
        if (!searchKeyword.trim()) {
            alert("Enter a keyword");
            return;
        }

        setSearchClicked(true); // Mark that search was triggered

        axios.get(`http://localhost:3000/api/scholarships?search=${searchKeyword}`)
            .then((res) => {
                console.log("API Response:", res.data);

                const filteredResults = res.data.filter((scholarship) =>
                    scholarship.title.toLowerCase().includes(searchKeyword.toLowerCase())
                );

                setScholarships(filteredResults);
            })
            .catch((err) => {
                console.error("Error fetching scholarships:", err);
                alert("Failed to fetch scholarships.");
            });
    };

    return (
        <div className="user-dashboard">
            <h2>Find Scholarships</h2>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search Scholarships"
                    value={searchKeyword}
                    onChange={(e) => {
                        setSearchKeyword(e.target.value);
                        setSearchClicked(false); // Reset on new input
                    }}
                />
                <button className="search-btn" onClick={fetchScholarships}>
                    Search
                </button>
            </div>

            {searchClicked && (
                <>
                    {scholarships.length > 0 ? (
                        <>
                            <p className="match-count">
                                Total Matches: {scholarships.length}
                            </p>
                            <ul className="scholarship-list">
                                {scholarships.map((scholarship) => (
                                    <li key={scholarship.id} className="scholarship-item">
                                        <div className="scholarship-details">
                                            <h4>{scholarship.title}</h4>
                                            <p>{scholarship.description}</p>
                                            <p>
                                                <strong>Deadline:</strong>{" "}
                                                {new Date(scholarship.deadline)
                                                    .toISOString()
                                                    .split("T")[0]}
                                            </p>
                                            <button className="details-btn">
                                                See Details
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <p className="no-results">
                            No scholarships found. Try searching again!
                        </p>
                    )}
                </>
            )}
        </div>
    );
};

export default Scholarships;
