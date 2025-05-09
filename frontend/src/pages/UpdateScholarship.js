import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/UpdateScholarship.css";

const UpdateScholarship = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        provider: "",
        type: "",
        application_steps: [],
        youtube_video: "",
        official_link: "",
        deadline: "",
    });

    const [loading, setLoading] = useState(true);

    // Fetch scholarship details
    useEffect(() => {
        axios.get(`http://localhost:3000/api/scholarships/${id}`)
            .then((res) => {
                const scholarship = res.data;
                setFormData({
                    title: scholarship.title,
                    description: scholarship.description,
                    provider: scholarship.provider,
                    type: scholarship.type,
                    application_steps: scholarship.application_steps.join("\n"), // assuming it's an array of strings
                    youtube_video: scholarship.youtube_video || "",
                    official_link: scholarship.official_link,
                    deadline: scholarship.deadline.split("T")[0], // Date formatting
                });
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching scholarship:", err);
                alert("Failed to load scholarship.");
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3000/api/scholarships/${id}`, formData)
            .then(() => {
                alert("Scholarship updated successfully.");
                navigate("/admin-dashboard"); // Redirect to AdminDashboard
            })
            .catch((err) => {
                console.error("Error updating scholarship:", err);
                alert("Failed to update scholarship.");
            });
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="update-scholarship-container">
            <h5>Update Scholarship</h5>
            <form onSubmit={handleSubmit} className="update-scholarship-form">
                
                <label>Title:</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />

                <label>Description:</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />

                <label>Provider:</label>
                <input
                    type="text"
                    name="provider"
                    value={formData.provider}
                    onChange={handleChange}
                    required
                />

                <label>Type:</label>
                <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                >
                    <option value="government">Government</option>
                    <option value="private">Private</option>
                </select>

                <label>Application Steps:</label>
                <textarea
                    name="application_steps"
                    value={formData.application_steps}
                    onChange={(e) => setFormData({ ...formData, application_steps: e.target.value.split("\n") })}
                    placeholder="Enter each application step on a new line."
                    required
                />

                <label>YouTube Video Link:</label>
                <input
                    type="url"
                    name="youtube_video"
                    value={formData.youtube_video}
                    onChange={handleChange}
                />

                <label>Official Link:</label>
                <input
                    type="url"
                    name="official_link"
                    value={formData.official_link}
                    onChange={handleChange}
                    required
                />

                <label>Deadline:</label>
                <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    required
                />

                <button type="submit">Update Scholarship</button>
            </form>
        </div>
    );
};

export default UpdateScholarship;
