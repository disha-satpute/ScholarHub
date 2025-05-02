import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/UserDashboard.css";

const UserDashboard = () => {
    const [states, setStates] = useState([]);
    const [castes, setCastes] = useState([]);
    const [educationLevels, setEducationLevels] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [selectedCaste, setSelectedCaste] = useState("");
    const [selectedEducation, setSelectedEducation] = useState("");
    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);

        // Fetch states, castes, and education levels
        Promise.all([
            fetch("http://localhost:3000/api/scholarships/states"),
            fetch("http://localhost:3000/api/scholarships/castes"),
            fetch("http://localhost:3000/api/scholarships/education_levels"),
        ])
            .then(async ([statesRes, castesRes, educationLevelsRes]) => {
                if (!statesRes.ok || !castesRes.ok || !educationLevelsRes.ok) {
                    throw new Error("Error fetching data");
                }
                const statesData = await statesRes.json();
                const castesData = await castesRes.json();
                const educationLevelsData = await educationLevelsRes.json();
                setStates(statesData);
                setCastes(castesData);
                setEducationLevels(educationLevelsData);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

  /*  const fetchScholarships = async () => {
        setLoading(true);
        setError(null);

        try {
            const queryParams = new URLSearchParams();
            if (selectedState) queryParams.append("state", selectedState);
            if (selectedCaste) queryParams.append("caste", selectedCaste);
            if (selectedEducation) queryParams.append("education", selectedEducation);

            const response = await fetch(
                `http://localhost:3000/api/scholarships?${queryParams.toString()}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setScholarships(data);
        } catch (error) {
            setError("Error fetching scholarships");
        } finally {
            setLoading(false);
        }
    };
*/
const fetchScholarships = async () => {
    setLoading(true);
    setError(null);

    try {
        // Ensure at least one filter is selected
        if (!selectedState && !selectedCaste && !selectedEducation) {
            alert("Please select at least one filter.");
            setLoading(false);
            return;
        }

        const queryParams = new URLSearchParams();
        if (selectedState) queryParams.append("stateId", selectedState);
        if (selectedCaste) queryParams.append("casteId", selectedCaste);
        if (selectedEducation) queryParams.append("educationLevelId", selectedEducation);

        const response = await fetch(`http://localhost:3000/api/scholarships?${queryParams.toString()}`);

        if (!response.ok) {
            throw new Error("Error fetching scholarships");
        }

        const data = await response.json();
        setScholarships(data);
    } catch (error) {
        setError("Something went wrong while filtering scholarships.");
    } finally {
        setLoading(false);
    }
};

const saveToProfile = async (scholarshipId) => {
    try {
        const token = localStorage.getItem("userToken");
        const response = await fetch("http://localhost:3000/api/auth/save-scholarship", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // ✅ Send token
            },
            body: JSON.stringify({ scholarshipId }),
        });

        if (!response.ok) {
            throw new Error("Failed to save scholarship.");
        }

        alert("Scholarship saved to your profile!");
    } catch (error) {
        console.error("Error saving scholarship:", error);
        alert("Error saving scholarship. Please try again.");
    }
};


    return (
        <div className="user-dashboard">
            <h2>Scholarships</h2>

            <div className="search-container">
                <label>
                    State:
                    <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
                        <option value="">Select State</option>
                        {states.map((state) => (
                            <option key={state.id} value={state.id}>
                                {state.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Caste:
                    <select value={selectedCaste} onChange={(e) => setSelectedCaste(e.target.value)}>
                        <option value="">Select Caste</option>
                        {castes.map((caste) => (
                            <option key={caste.id} value={caste.id}>
                                {caste.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Education Level:
                    <select value={selectedEducation} onChange={(e) => setSelectedEducation(e.target.value)}>
                        <option value="">Select Education Level</option>
                        {educationLevels.map((level) => (
                            <option key={level.id} value={level.id}>
                                {level.name}
                            </option>
                        ))}
                    </select>
                </label>

                <button className="filter-btn" onClick={fetchScholarships} disabled={loading}>
                    {loading ? "Loading..." : "Filter Scholarships"}
                </button>
            </div>

            <div className="scholarship-list">
                {loading && <p>Loading scholarships...</p>}
                {error && <p className="error">{error}</p>}

                {scholarships.length > 0 ? (
                    <ul>
                        {scholarships.map((scholarship) => (
                            <li key={scholarship.id} className="scholarship-item">
                                <div className="scholarship-details">
                                    <h4>{scholarship.title}</h4>
                                    <p>{scholarship.description}</p>
                                </div>
                                <div className="scholarship-actions">
                                <Link to={`/scholarship-details/${scholarship.id}`}>
    <button className="details-btn">See Details</button>
</Link>

                                    <button className="save-btn" onClick={() => saveToProfile(scholarship.id)}>
                                        Save to Profile
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    !loading && <p className="no-scholarships">No scholarships found.</p>
                )}
            </div>
            <Link to="/user-profile">
                <button className="dash" >Go to profile</button>
            </Link>
        </div>
    );
};

export default UserDashboard;


