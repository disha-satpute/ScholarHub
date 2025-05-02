import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/AddScholarship.css';

const AddScholarship = () => {
    const initialState = {
        title: "",
        description: "",
        provider: "",
        type: "government",
        state_ids: [],
        caste_ids: [],
        education_level_ids: [],
        application_steps: [],
        youtube_video: "",
        official_link: "",
        deadline: "",
    };
    
    const [scholarship, setScholarship] = useState(initialState);
    const [allStates, setAllStates] = useState([]);
    const [allCastes, setAllCastes] = useState([]);
    const [allEducationLevels, setAllEducationLevels] = useState([]);
    const [steps, setSteps] = useState([""]);

    useEffect(() => {
        axios.get("http://localhost:3000/api/scholarships/states")
            .then((res) => setAllStates(res.data))
            .catch((err) => console.error("Error fetching states:", err));

        axios.get("http://localhost:3000/api/scholarships/castes")
            .then((res) => setAllCastes(res.data))
            .catch((err) => console.error("Error fetching castes:", err));

        axios.get("http://localhost:3000/api/scholarships/education_levels")
            .then((res) => setAllEducationLevels(res.data))
            .catch((err) => console.error("Error fetching education levels:", err));
    }, []);

    const handleChange = (e) => {
        setScholarship({ ...scholarship, [e.target.name]: e.target.value });
    };

    const handleMultiSelectChange = (e, field) => {
        const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
        setScholarship({ ...scholarship, [field]: selectedOptions });
    };

    const handleStepChange = (index, value) => {
        const newSteps = [...steps];
        newSteps[index] = value;
        setSteps(newSteps);
    };

    const addStep = () => setSteps([...steps, ""]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            ...scholarship,
            application_steps: JSON.stringify(steps), // ✅ Ensure correct format
        };

        try {
            await axios.post("http://localhost:3000/api/scholarships", formData, {
                headers: { "Content-Type": "application/json" },
            });
            alert("Scholarship added successfully!");
            setScholarship(initialState); // ✅ Reset form fields
            setSteps([""]); // ✅ Reset steps field
        } catch (error) {
            console.error("Error adding scholarship:", error);
            alert("Error adding scholarship");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="title" placeholder="Title" value={scholarship.title} onChange={handleChange} required />
            <textarea name="description" placeholder="Description" value={scholarship.description} onChange={handleChange} required />
            <input type="text" name="provider" placeholder="Provider" value={scholarship.provider} onChange={handleChange} required />
            <select name="type" value={scholarship.type} onChange={handleChange}>
                <option value="government">Government</option>
                <option value="private">Private</option>
            </select>

            {/* Multi-select for states */}
            <label>States:</label>
            <select multiple onChange={(e) => handleMultiSelectChange(e, "state_ids")}>
                {allStates.map((state) => (
                    <option key={state.id} value={state.id}>{state.name}</option>
                ))}
            </select>

            {/* Multi-select for castes */}
            <label>Castes:</label>
            <select multiple onChange={(e) => handleMultiSelectChange(e, "caste_ids")}>
                {allCastes.map((caste) => (
                    <option key={caste.id} value={caste.id}>{caste.name}</option>
                ))}
            </select>

            {/* Multi-select for education levels */}
            <label>Education Levels:</label>
            <select multiple onChange={(e) => handleMultiSelectChange(e, "education_level_ids")}>
                {allEducationLevels.map((level) => (
                    <option key={level.id} value={level.id}>{level.name}</option>
                ))}
            </select>

            {/* Steps Input */}
            {steps.map((step, index) => (
                <input
                    key={index}
                    type="text"
                    placeholder={`Step ${index + 1}`}
                    value={step}
                    onChange={(e) => handleStepChange(index, e.target.value)}
                    required
                />
            ))}
            <button type="button" onClick={addStep}>+ Add Step</button>

            {/* YouTube Video Link */}
            <input type="text" name="youtube_video" placeholder="YouTube Video Link" value={scholarship.youtube_video} onChange={handleChange} />

            {/* Official Link */}
            <input type="text" name="official_link" placeholder="Official Link" value={scholarship.official_link} onChange={handleChange} required />

            {/* Deadline */}
            <input type="date" name="deadline" value={scholarship.deadline} onChange={handleChange} required />

            <button type="submit">Submit Scholarship</button>
        </form>
    );
};

export default AddScholarship;
