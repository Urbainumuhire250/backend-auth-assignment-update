const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // Step 7: Compare allowed roles with the user's role from the token [cite: 48]
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            // Step 7: Block unauthorized roles [cite: 54]
            return res.status(403).json({ 
                message: "Access Denied: Your role does not have permission for this resource" 
            });
        }
        // Step 7: Authorized roles pass through [cite: 55]
        next();
    };
};

module.exports = authorizeRoles;