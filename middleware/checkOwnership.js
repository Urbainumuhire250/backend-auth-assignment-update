const checkOwnership = (req, res, next) => {
    const userIdFromToken = req.user.id; // From the decoded JWT (Step 6)
    const requestedResourceId = parseInt(req.params.id); // From the URL /users/:id

    // Step 9: Allow admins to bypass ownership check
    if (req.user.role === 'admin') {
        return next();
    }

    // Step 9: Compare token user ID with requested resource ID
    if (userIdFromToken !== requestedResourceId) {
        // Step 9: Users cannot access others' data
        return res.status(403).json({ 
            message: "Access Denied: You do not own this resource." 
        });
    }

    // Step 9: Users can access their own data
    next();
};

module.exports = checkOwnership;