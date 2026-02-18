 const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Import Middleware - Ensure folder names match (Case-Sensitive!)
const authenticateToken = require('../Middleware/auth');
const authorizeRoles = require('../Middleware/checkRole');
const workingHoursOnly = require('../Middleware/workingHours');
const checkOwnership = require('../Middleware/checkOwnership');

// 1. Admin Route
router.get('/admin-only', authenticateToken, authorizeRoles('admin'), (req, res) => {
    res.json({ message: "Welcome to the secret admin area!" });
});

// 2. Finance Reports Route
router.get('/finance/reports/:id', 
    authenticateToken, 
    workingHoursOnly, 
    authorizeRoles('manager', 'admin'), 
    checkOwnership, 
    (req, res) => {
        res.json({ message: "Secure report data accessed." });
    }
);

// 3. Register Route
router.post('/register', async (req, res) => {
    const { name, username, password, email, role, department } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO users (name, username, password, email, role, department) VALUES (?, ?, ?, ?, ?, ?)";
        
        db.query(sql, [name, username, hashedPassword, email, role, department], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: "Username or Email already exists" });
                }
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: "User registered successfully!" });
        });
    } catch (error) {
        res.status(500).json({ message: "Server error during registration" });
    }
});

// 4. Login Route
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM users WHERE username = ?";

    db.query(sql, [username], async (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ message: "Invalid credentials" });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user.id, role: user.role, department: user.department },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    });
});

// Example: A route that requires BOTH valid login AND working hours
router.get('/secure-data', 
    authenticateToken, // Step 1: Who are you?
    workingHoursOnly,  // Step 2: Is it the right time?
    (req, res) => {
        res.json({ message: "Access granted! You are logged in and working within hours." });
    }
);

// Example: A route that ONLY requires login (no time restriction)
router.get('/profile', authenticateToken, (req, res) => {
    res.json({ message: "You can view your profile anytime.", user: req.user });
});



module.exports = router;