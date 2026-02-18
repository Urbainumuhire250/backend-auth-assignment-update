const workingHoursOnly = (req, res, next) => {
    const currentHour = new Date().getHours(); // Get current hour (0-23)

    // Define working hours: 9 AM (9) to 5 PM (17)
    const start = 9;
    const end = 17;
    
    if (req.user && req.user.role === 'admin') {
        return next();
    }

    if (currentHour < start || currentHour >= end) {
        // Step 10: Block access outside working hours 
        return res.status(403).json({ 
            message: "Access Denied: You can only access this resource during working hours (09:00 - 17:00)." 
        });
    }

    // If within hours, proceed [cite: 85]
    next();
};

module.exports = workingHoursOnly;