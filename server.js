 require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./config/db');

// Import Middleware - Folder name 'Middleware' is capitalized in your sidebar
const authenticateToken = require('./Middleware/auth');

// Import Routes
const authRoutes = require('./routes/authRoutes');

// --- Middleware ---
// Essential: This allows your server to read JSON data sent in login/register requests
app.use(express.json()); 

// --- Routes ---
// This mounts all routes from authRoutes.js under the /api/auth prefix
app.use('/api/auth', authRoutes);

// Protected route example to verify Authentication Middleware
app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ 
        message: "You have accessed a protected route!", 
        user: req.user 
    });
});

// --- Start the server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});