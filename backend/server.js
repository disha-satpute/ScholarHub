const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const scholarshipRoutes = require('./routes/scholarshipRoutes');
const path = require("path");
require('dotenv').config();
const db = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use("/api/admin", adminRoutes);


app.get('/', (req, res) => {
  res.send('ScholarHub API is running...');
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
