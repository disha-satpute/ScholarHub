import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Details.css";

const Details = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [scholarship, setScholarship] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchScholarship = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/scholarships/${id}`);
                setScholarship(res.data);
            } catch (err) {
                console.error(err);
                setError("Unable to fetch scholarship details.");
            }
        };
        fetchScholarship();
    }, [id]);

    if (error) return <p className="error">{error}</p>;
    if (!scholarship) return <p className="loading">Loading scholarship details...</p>;

    return (
        <div className="details-container">
            <h2>{scholarship.title}</h2>
            <p><strong>Description:</strong> {scholarship.description}</p>
            <p><strong>Provider:</strong> {scholarship.provider}</p>
            <p><strong>Type:</strong> {scholarship.type}</p>
            <p><strong>Amount:</strong> ₹{scholarship.amount || "Not specified"}</p>
            <p><strong>Deadline:</strong> {scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : "N/A"}</p>

            <p><strong>State:</strong> {
                scholarship.states && scholarship.states.length > 0
                    ? scholarship.states.join(", ")
                    : "N/A"
            }</p>

            <p><strong>Caste:</strong> {
                scholarship.castes && scholarship.castes.length > 0
                    ? scholarship.castes.join(", ")
                    : "N/A"
            }</p>

            <p><strong>Education Level:</strong> {
                scholarship.education_levels && scholarship.education_levels.length > 0
                    ? scholarship.education_levels.join(", ")
                    : "N/A"
            }</p>

            {scholarship.application_steps && scholarship.application_steps.length > 0 && (
                <div>
                    <strong>Application Steps:</strong>
                    <ul>
                        {scholarship.application_steps.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ul>
                </div>
            )}

            {scholarship.youtube_video && (
                <div className="video-section">
                    <strong>Video Guide:</strong><br />
                    <iframe
                        width="100%"
                        height="315"
                        src={scholarship.youtube_video}
                        title="Scholarship Video"
                        frameBorder="0"
                        allowFullScreen
                    />
                </div>
            )}

            {scholarship.official_link && (
                <p>
                    <strong>Official Link:</strong>{" "}
                    <a href={scholarship.official_link} target="_blank" rel="noreferrer">
                        Visit Official Website
                    </a>
                </p>
            )}

            <button onClick={() => navigate("/admin-profile")} className="back-btn">
                ⬅ Back to Profile
            </button>
            <div className="admin-actions">
            <button onClick={() => navigate(`/update-scholarship/${scholarship.id}`)}>
        ✏️ Update
    </button>
    <button
        className="delete-btn"
        onClick={async () => {
            const confirmDelete = window.confirm("Are you sure you want to delete this scholarship?");
            if (confirmDelete) {
                try {
                    await axios.delete(`http://localhost:3000/api/scholarships/${scholarship.id}`);
                    alert("Scholarship deleted successfully!");
                    navigate("/admin-profile");
                } catch (err) {
                    console.error("Delete error:", err);
                    alert("Failed to delete scholarship.");
                }
            }
        }}
    >
        🗑️ Remove
    </button>
</div>

        </div>
    );
};

export default Details;
