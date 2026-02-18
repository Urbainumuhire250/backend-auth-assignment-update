const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    // Read token from Authorization header [cite: 35]
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    // Missing token → unauthorized [cite: 40]
    if (!token) {
        return res.status(401).json({ message: "Access Denied: No token provided" });
    }

    // Verify token signature and expiry [cite: 36]
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // Invalid or expired token → forbidden [cite: 41]
            return res.status(403).json({ message: "Access Denied: Invalid or expired token" });
        }

        // Decode token payload and attach user info to request object [cite: 37, 38]
        // This includes id, role, and department from the login step [cite: 27]
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;