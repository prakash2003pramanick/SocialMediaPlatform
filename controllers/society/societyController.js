require('../../models/Society');
const mongoose = require('mongoose');
const Society = mongoose.model('society');

const getSocietyProfile = async (req, res) => {
    try {
        const society = await society.findOne({ email: req.user.email });

        if (!society) {
            return res.status(404).send({ status: "ERROR", message: "society not found" });
        }

        res.status(200).send({ status: "OK", data: society });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ status: "ERROR", message: "Internal Server Error" });
    }
};

const updateSocietyProfile = async (req, res) => {
    try {
        const updateData = req.body;

        const updatedSociety = await society.findOneAndUpdate(
            { email: req.user.email },
            updateData,
            { new: true } // Return the updated society data
        );

        if (!updatedSociety) {
            return res.status(404).send({ status: "ERROR", message: "society not found" });
        }

        res.status(200).send({ status: "OK", message: "society profile updated successfully", data: updatedSociety });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ status: "ERROR", message: "Internal Server Error" });
    }
};

const deleteSocietyProfile = async (req, res) => {
    try {
        const deletedSociety = await Society.findOneAndDelete({ email: req.user.email });

        if (!deletedSociety) {
            return res.status(404).send({ status: "ERROR", message: "society not found" });
        }

        res.status(200).send({ status: "OK", message: "society deleted successfully", data: deletedSociety });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ status: "ERROR", message: "Internal Server Error" });
    }
};

//Member related functions

const getMembers = async (req, res) => {
    try {
        // Fetch society members from the database
        const society = await Society.findOne({ email: req.user.email });
        const members = society.members;

        // Return the members list
        res.status(200).send({ status: "OK", data: members });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ status: "ERROR", message: "Internal Server Error" });
    }
};

// Function to update a member's position in the society
const updateMember = async (req, res) => {
    try {
        
        const { email, position } = req.body; // here email refers to the Member's emails whose details has to be updated

        // // Find the society by email
        // const society = await society.findOne({ email: req.user.email });

        // // Find the member in the society by email
        // const member = society.members.find(member => member.email === email);

        // Find the member in the society by email and update the position
        const member = await society.findOneAndUpdate(
            { email: req.user.email, 'members.email': email }, // Find the society and the member by email....'member.email' denotes the field within the email
            { $set: { 'members.$.position': position } }, // Update the position of the member
            { new: true } // Return the modified document
        );

        // If member not found, return error
        if (!member) {
            return res.status(404).send({ status: "ERROR", message: "Member not found in the society" });
        }

        // // Update the position of the member
        // member.position = position;

        // // Save the updated society
        // await society.save();

        res.status(200).send({ status: "OK", message: "Member position updated successfully" });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ status: "ERROR", message: "Internal Server Error" });
    }
};


module.exports = { getSocietyProfile, updateSocietyProfile, deleteSocietyProfile, getMembers, updateMember };
