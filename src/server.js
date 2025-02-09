/*/ server.js
import express from 'express';
import cors from 'cors';
import pool from '../db.js'; // Ensure db.js is also using ES module syntax

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // for parsing application/json

// Sample GET endpoint
app.get('/api/scholarships', async (req, res) => {
    // Your logic to fetch scholarships from the database
    res.json({ message: 'This is a sample response' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});*/
const { Client } = require('pg');

// Database connection configuration
const client = new Client({
    user: 'your_username',        // Replace with your database username
    host: 'your_host',            // Replace with your database host
    database: 'your_database',    // Replace with your database name
    password: 'your_password',    // Replace with your database password
    port: 5432,                   // Default PostgreSQL port
});

// Connect to the database
client.connect()
    .then(() => {
        console.log('Connected to PostgreSQL database successfully!');
        return client.query('SELECT NOW()'); // Optional: Test query to check connection
    })
    .then((res) => {
        console.log('Current time from database:', res.rows[0]);
    })
    .catch((err) => {
        console.error('Connection error', err.stack);
    })
    .finally(() => {
        client.end(); // Close the connection
    });