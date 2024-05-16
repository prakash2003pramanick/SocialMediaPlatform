
require('../models/Society');
const mongoose = require('mongoose');
const Society = mongoose.model('Society');
const { ADMIN } = require('../enum/accessTypes.js');


// Function to approve a society
const approveSociety = async (req, res) => {
    try {
        
        // In case the user is not admin 
        if(req.user.access != ADMIN){
            return res.status(403).send({ status: "FORBIDDDEN", message: "USER IS NOT ELIGIBLE FOR MAKING THESE CHANGES" });
        }

        const { email } = req.body; // here email refers to the Society's email that has to be verified

        // Find the society by email and update the approval status
        const verified = await Society.findOneAndUpdate(
            { email: req.user.email, approvedbyadmin : false },
            { $set: { approvedbyadmin : true } }, // Update the approvedbyadmin of the society 
            { new: true } // Return the modified document
        );

        // If society not found, return error
        if (!verified) {
            return res.status(404).send({ status: "ERROR", message: "Society not found" });
        }

        res.status(200).send({ status: "OK", message: "Member position updated successfully" });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ status: "ERROR", message: "Internal Server Error" });
    }
};


module.exports = { approveSociety };
