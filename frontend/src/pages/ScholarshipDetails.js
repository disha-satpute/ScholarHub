import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../styles/ScholarshipDetails.css";

const ScholarshipDetails = () => {
    const { id } = useParams();
    const [scholarship, setScholarship] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchScholarship = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/scholarships/${id}`);
                setScholarship(res.data);
            } catch (err) {
                setError("Unable to fetch scholarship details.");
            }
        };
        fetchScholarship();
    }, [id]);

    if (error) return <p>{error}</p>;
    if (!scholarship) return <p>Loading...</p>;

    return (
        <div className="scholarship-details-container">
            <h2>{scholarship.title}</h2>
            <p className="provider"><strong>Provider:</strong> {scholarship.provider}</p>
            <p className="type"><strong>Type:</strong> {scholarship.type}</p>
            <p className="deadline"><strong>Deadline:</strong> {new Date(scholarship.deadline).toLocaleDateString()}</p>

            <div className="section">
                <h4>Description</h4>
                <p>{scholarship.description}</p>
            </div>

            {scholarship.application_steps && scholarship.application_steps.length > 0 && (
                <div className="section">
                    <h4>Application Steps</h4>
                    <ol>
                        {scholarship.application_steps.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
            )}

            {scholarship.official_link && (
                <div className="section">
                    <h4>Official Link</h4>
                    <a href={scholarship.official_link} target="_blank" rel="noopener noreferrer" className="official-link">
                        Visit Scholarship Website
                    </a>
                </div>
            )}

            {scholarship.youtube_video && (
                <div className="section">
                    <h4>Watch Video Guide</h4>
                    <iframe
                        className="youtube-video"
                        src={scholarship.youtube_video}
                        title="Scholarship Video"
                        allowFullScreen
                    />
                </div>
            )}

            <Link to="/user-profile">
                <button className="back-btn">← Back to Profile</button>
            </Link>
        </div>
    );
};

export default ScholarshipDetails;
