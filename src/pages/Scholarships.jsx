import React, { useState, useEffect } from 'react';

const Scholarship = () => {
    const [scholarships, setScholarships] = useState([]); // All scholarships
    const [filteredScholarships, setFilteredScholarships] = useState([]); // Scholarships after filtering
    const [state, setState] = useState('');
    const [caste, setCaste] = useState('');
    const [education, setEducation] = useState('');
    const [year, setYear] = useState('');

    // Sample data fetching (replace with your actual data fetching logic)
    useEffect(() => {
        // Fetch scholarships from your API or database
        const fetchScholarships = async () => {
            const response = await fetch('/api/scholarships'); // Adjust the API endpoint
            const data = await response.json();
            setScholarships(data);
            setFilteredScholarships(data); // Initially show all scholarships
        };

        fetchScholarships();
    }, []);
    const handleFilter = () => {
        const filtered = scholarships.filter(scholarship => {
            return (
                (state ? scholarship.state === state : true) &&
                (caste ? scholarship.caste === caste : true) &&
                (education ? scholarship.education === education : true) &&
                (year ? scholarship.year === year : true)
            );
        });
        setFilteredScholarships(filtered);
    };

    return (
        <div>
            <h1>Scholarships</h1>

            <div>
                <label>State:</label>
                <select value={state} onChange={(e) => setState(e.target.value)}>
                    <option value="">Select State</option>
                    {/* Populate with actual states */}
                    <option value="State1">State1</option>
                    <option value="State2">State2</option>
                </select>
            </div>

            <div>
                <label>Caste:</label>
                <select value={caste} onChange={(e) => setCaste(e.target.value)}>
                    <option value="">Select Caste</option>
                    {/* Populate with actual castes */}
                    <option value="Caste1">Caste1</option>
                    <option value="Caste2">Caste2</option>
                </select>
            </div>

            <div>
                <label>Education:</label>
                <select value={education} onChange={(e) => setEducation(e.target.value)}>
                    <option value="">Select Education Level</option>
                    {/* Populate with actual education levels */}
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                </select>
            </div>

            <div>
                <label>Year:</label>
                <select value={year} onChange={(e) => setYear(e.target.value)}>
                    <option value="">Select Year</option>
                    {/* Populate with actual years */}
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                </select>
            </div>

            <button onClick={handleFilter}>Filter Scholarships</button>

            <h2>Available Scholarships</h2>
            <ul>
                {filteredScholarships.map(scholarship => (
                    <li key={scholarship.id}>{scholarship.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Scholarship;