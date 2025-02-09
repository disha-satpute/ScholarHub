import React, { useState, useEffect } from 'react';
import '../styles/Scholarships.css'; // Import your CSS file

const Scholarships = () => {
    const [scholarships, setScholarships] = useState([]); // All scholarships
    const [filteredScholarships, setFilteredScholarships] = useState([]); // Scholarships after filtering
    const [state, setState] = useState('');
    const [caste, setCaste] = useState('');
    const [education, setEducation] = useState('');

    // Fetch scholarships from your API or database
    useEffect(() => {
        const fetchScholarships = async () => {
            try {
                const response = await fetch('/api/scholarships'); // Adjust the API endpoint
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setScholarships(data);
                setFilteredScholarships(data); // Initially show all scholarships
            } catch (error) {
                console.error('Error fetching scholarships:', error);
            }
        };

        fetchScholarships();
    }, []);

    // Function to handle filtering scholarships based on selected criteria
    const handleFilter = async () => {
        try {
            const queryParams = new URLSearchParams();
            if (state) queryParams.append('state', state);
            if (caste) queryParams.append('caste', caste);
            if (education) queryParams.append('education', education);

            const response = await fetch(`/api/scholarships?${queryParams.toString()}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setFilteredScholarships(data);
        } catch (error) {
            console.error('Error fetching scholarships:', error);
        }
    };

    return (
        <div className="scholarships"> 
            <h1>Scholarships</h1>

            <div className="filter-container">
                <div>
                    <label htmlFor="state">State:</label>
                    <select id="state" value={state} onChange={(e) => setState(e.target.value)}>
                        <option value="">Select State</option>
                        {/* Populate with actual states */} <option value="Maharashtra">Maharashtra</option>
                        <option value="Nashik">Nashik</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="caste">Caste:</label>
                    <select id="caste" value={caste} onChange={(e) => setCaste(e.target.value)}>
                        <option value="">Select Caste</option>
                        {/* Populate with actual castes */}
                        <option value="General">General</option>
                        <option value="OBC">OBC</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="education">Education:</label>
                    <select id="education" value={education} onChange={(e) => setEducation(e.target.value)}>
                        <option value="">Select Education Level</option>
                        {/* Populate with actual education levels */}
                        <option value="UG/PG">UG/PG</option>
                        <option value="Diploma">Diploma</option>
                    </select>
                </div>
                <button onClick={handleFilter}>Filter Scholarships</button>
            </div>

            <h2>Available Scholarships</h2>
            <ul className="scholarship-list">
                {filteredScholarships.length > 0 ? (
                    filteredScholarships.map(scholarship => (
                        <li key={scholarship.id} className="scholarship-item">{scholarship.name}</li>
                    ))
                ) : (
                    <li>No scholarships found.</li>
                )}
            </ul>
        </div>
    );
};

export default Scholarships;