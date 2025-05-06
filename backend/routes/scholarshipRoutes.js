const express = require("express");
const pool = require("../config/db");


const router = express.Router();



// 📌 Add Scholarship Route (✅ Fixed Multi-Select + Image Upload)
router.post("/", async (req, res) => {
    try {
        const { title, description, provider, type, youtube_video, official_link, deadline } = req.body;
        const states = req.body.state_ids || [];
        const castes = req.body.caste_ids || [];
        const education_levels = req.body.education_level_ids || [];
        const application_steps = JSON.parse(req.body.application_steps || "[]"); // Ensure it's an array

        // Insert Scholarship
        const result = await pool.query(
            "INSERT INTO scholarships (title, description, provider, type, application_steps, youtube_video, official_link, deadline) VALUES ($1, $2, $3, $4, $5::text[], $6, $7, $8) RETURNING id",
            [title, description, provider, type, application_steps, youtube_video, official_link, deadline]
        );

        const scholarshipId = result.rows[0].id;

        // Insert Related Data (States, Castes, Education Levels)
        await Promise.all([
            ...states.map(stateId => pool.query("INSERT INTO scholarship_states (scholarship_id, state_id) VALUES ($1, $2)", [scholarshipId, stateId])),
            ...castes.map(casteId => pool.query("INSERT INTO scholarship_castes (scholarship_id, caste_id) VALUES ($1, $2)", [scholarshipId, casteId])),
            ...education_levels.map(eduId => pool.query("INSERT INTO scholarship_education_levels (scholarship_id, education_level_id) VALUES ($1, $2)", [scholarshipId, eduId]))
        ]);

        res.json({ message: "Scholarship added successfully!" });
    } catch (error) {
        console.error("Error inserting scholarship:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});


// 📌 Get Scholarships with Filters (✅ Supports Partial Filtering)
router.get("/", async (req, res) => {
    try {
        const { stateId, casteId, educationLevelId } = req.query;

        let query = `
            SELECT s.*, 
                   ARRAY_AGG(DISTINCT st.name) AS states,
                   ARRAY_AGG(DISTINCT c.name) AS castes,
                   ARRAY_AGG(DISTINCT e.name) AS education_levels
            FROM scholarships s
            LEFT JOIN scholarship_states ss ON s.id = ss.scholarship_id
            LEFT JOIN states st ON ss.state_id = st.id
            LEFT JOIN scholarship_castes sc ON s.id = sc.scholarship_id
            LEFT JOIN castes c ON sc.caste_id = c.id
            LEFT JOIN scholarship_education_levels se ON s.id = se.scholarship_id
            LEFT JOIN education_levels e ON se.education_level_id = e.id
            WHERE 1=1
        `;

        let params = [];
        if (stateId) {
            params.push(parseInt(stateId));
            query += ` AND st.id = $${params.length}`;
        }
        if (casteId) {
            params.push(parseInt(casteId));
            query += ` AND c.id = $${params.length}`;
        }
        if (educationLevelId) {
            params.push(parseInt(educationLevelId));
            query += ` AND e.id = $${params.length}`;
        }
        
        

        query += " GROUP BY s.id";

        const scholarships = await pool.query(query, params);
        res.json(scholarships.rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 Get States
router.get("/states", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM states ORDER BY name ASC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

// 📌 Get Castes
router.get("/castes", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM castes ORDER BY name ASC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

// 📌 Get Education Levels
router.get("/education_levels", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM education_levels ORDER BY name ASC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

// 📌 Delete Scholarship
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM scholarships WHERE id = $1", [id]);
        res.json({ message: "Scholarship deleted successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});
router.post("/api/scholarships", (req, res) => {
    // Your logic to save the scholarship data in the database
    console.log(req.body); // Debugging
    res.status(201).json({ message: "Scholarship added successfully!" });
});



// 📌 Get Saved Scholarships for a User
router.get("/saved/:user_id", async (req, res) => {
    try {
        const { user_id } = req.params;
        const result = await pool.query(
            `SELECT s.* FROM scholarships s
             INNER JOIN user_saved_scholarships uss ON s.id = uss.scholarship_id
             WHERE uss.user_id = $1`, [user_id]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching saved scholarships:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});
router.delete("/saved/:user_id/:scholarship_id", async (req, res) => {
    try {
        const { user_id, scholarship_id } = req.params;

        await pool.query("DELETE FROM user_saved_scholarships WHERE user_id = $1 AND scholarship_id = $2", [user_id, scholarship_id]);

        res.json({ message: "Scholarship removed from saved list!" });
    } catch (error) {
        console.error("Error removing scholarship:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// 📌 Get Single Scholarship by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(`
            SELECT 
                s.*,
                ARRAY(
                    SELECT st.name
                    FROM scholarship_states ss
                    JOIN states st ON ss.state_id = st.id
                    WHERE ss.scholarship_id = s.id
                ) AS states,
                ARRAY(
                    SELECT c.name
                    FROM scholarship_castes sc
                    JOIN castes c ON sc.caste_id = c.id
                    WHERE sc.scholarship_id = s.id
                ) AS castes,
                ARRAY(
                    SELECT e.name
                    FROM scholarship_education_levels se
                    JOIN education_levels e ON se.education_level_id = e.id
                    WHERE se.scholarship_id = s.id
                ) AS education_levels
            FROM scholarships s
            WHERE s.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Scholarship not found' });
        }

        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
// 📌 update Single Scholarship by ID
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const {
        title,
        description,
        provider,
        type,
        application_steps,
        youtube_video,
        official_link,
        deadline
    } = req.body;

    try {
        const result = await pool.query(
            `UPDATE scholarships SET 
                title = $1,
                description = $2,
                provider = $3,
                type = $4,
                application_steps = $5,
                youtube_video = $6,
                official_link = $7,
                deadline = $8
            WHERE id = $9
            RETURNING *`,
            [
                title,
                description,
                provider,
                type,
                application_steps,
                youtube_video,
                official_link,
                deadline,
                id
            ]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Scholarship not found" });
        }

        res.json({
            message: "Scholarship updated successfully",
            scholarship: result.rows[0]
        });
    } catch (error) {
        console.error("Error updating scholarship:", error);
        res.status(500).json({ message: "Server error" });
    }
});
// DELETE a scholarship by ID
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM scholarships WHERE id = $1 RETURNING *", [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Scholarship not found" });
        }
        res.json({ message: "Scholarship deleted successfully" });
    } catch (error) {
        console.error("Error deleting scholarship:", error);
        res.status(500).json({ message: "Server error" });
    }
});



module.exports = router;
