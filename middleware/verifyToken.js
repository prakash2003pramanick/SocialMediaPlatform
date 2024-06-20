const jwt = require("jsonwebtoken");
require('../models/User');
require('../models/Society');
const mongoose = require('mongoose');
const User = mongoose.model('user');
const Society = mongoose.model('society');
const { USER, SOCIETY } = require('../enum/accessTypes');

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {
    console.log("VerifyToken middleware is being called");
    
    const token = req.headers.authorization;

    console.log("imported secret : " + JWT_SECRET);
    console.log("received token : " + token);

    if (!token) {
        console.log("Token not provided");
        return res.status(401).send({ status: "ERROR", message: "Unauthorized: Token not provided" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET, { maxAge: '70h' });

        console.log("Token verified");
        console.log(decoded);

        // Check if the access level is in the SOCIETY dictionary
        const societyAccessLevels = Object.values(SOCIETY);
        let userAccess;

        if (societyAccessLevels.includes(decoded.access)) {
            console.log("Access level belongs to a society");
            userAccess = await Society.findById(decoded.id).select('access');
        } else {
            console.log("Access level belongs to a user");
            userAccess = await User.findById(decoded.id).select('access');
        }

        console.log("Queried User/Society Access:", userAccess); // Add logging to check the queried user/society access

        if (!userAccess) {
            console.log("User or Society not found");
            return res.status(404).send({ status: "ERROR", message: "User or Society not found" });
        }

        // Overwrite the access level in the token with the one fetched from the database
        decoded.access = userAccess.access;

        req.user = decoded;
        next();
    } catch (err) {
        console.log("Error during token verification:", err);
        if (err.name === 'TokenExpiredError') {
            console.log("Token has expired");
            return res.status(401).send({ status: "ERROR", message: "Unauthorized: Token has expired" });
        } else {
            console.log("Invalid token");
            return res.status(403).send({ status: "ERROR", message: "Forbidden: Invalid token" });
        }
    }
};

module.exports = { verifyToken };
