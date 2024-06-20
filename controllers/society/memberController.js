const express = require('express');
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');

require('../../models/User');
require('../../models/Society');
const { USER, SOCIETY } = require('../../enum/accessTypes');

const User = mongoose.model('user');
const Society = mongoose.model('society');


//@description     Add a member
//@route           POST /api/society/add-member
//@access          Not only society can add members to its list 
const addMember = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: "ERROR", errors: errors.array() });
        }

        const { email, position } = req.body;

        if (!email || !position) {
            return res.status(400).send({ status: "ERROR", message: "Email or position is missing" });
        }

        // Find the user by email
        let user = await User.findOne({ email: { $eq: email } }).select('_id email');

        // If user is not found, set user._id to undefined
        if (!user) {
            user = { _id: undefined, email: email };
        }

        // Add user directly to members in the society
        const society = await Society.findByIdAndUpdate(
            req.user.id,
            { $push: { members: { id: user._id, email: email, position: position || "Executive" } } },
            { new: true }
        );

        if (!society) {
            return res.status(404).send({ status: "ERROR", message: "Society not found" });
        }

        res.status(200).send({ status: "OK", message: "Member added successfully", data: society.members[society.members.length-1] });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ status: "ERROR", message: "Internal Server Error" });
    }
};
const deleteMember = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: "ERROR", errors: errors.array() });
        }

        const { email } = req.body;

        // Remove user from members in the society
        const society = await Society.findOneAndUpdate(
            { email: { $eq: req.user.email } },
            { $pull: { members: { email: { $eq: email } } } },
            { new: true }
        );

        if (!society) {
            return res.status(404).send({ status: "ERROR", message: "Society not found" });
        }

        res.status(200).send({ status: "OK", message: "Member removed from society", data: society });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ status: "ERROR", message: "Internal Server Error" });
    }
};

const acceptMemberApproval = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: "ERROR", errors: errors.array() });
        }

        const { email } = req.body;

        // Find the society and the pending member by email
        const society = await Society.findOne({ email: { $eq: req.user.email } });
        if (!society) {
            return res.status(404).send({ status: "ERROR", message: "Society not found" });
        }
        const pendingMember = society.pendingVerification.find(member => member.email === email);

        if (!pendingMember) {
            return res.status(404).send({ status: "ERROR", message: "Pending member not found" });
        }

        // Add member to members and remove from pending verification
        const updatedSociety = await Society.findOneAndUpdate(
            { email: { $eq: req.user.email } },
            {
                $push: { members: pendingMember },
                $pull: { pendingVerification: { email: { $eq: email } } }
            },
            { new: true }
        );

        res.status(200).send({ status: "OK", message: "Member approval accepted", data: updatedSociety });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ status: "ERROR", message: "Internal Server Error" });
    }
};

const rejectMemberApproval = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: "ERROR", errors: errors.array() });
        }

        const { email } = req.body;

        // Remove user from pending verification in the society
        const society = await Society.findOneAndUpdate(
            { email: { $eq: req.user.email } },
            { $pull: { pendingVerification: { email: { $eq: email } } } },
            { new: true }
        );

        if (!society) {
            return res.status(404).send({ status: "ERROR", message: "Society not found" });
        }

        res.status(200).send({ status: "OK", message: "Member approval rejected", data: society });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ status: "ERROR", message: "Internal Server Error" });
    }
};

const updateMember = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: "ERROR", errors: errors.array() });
        }

        const { email, position } = req.body;

        // Find the member in the society by email and update the position
        const society = await Society.findOneAndUpdate(
            { email: { $eq: req.user.email }, 'members.email': { $eq: email } },
            { $set: { 'members.$.position': position } },
            { new: true }
        );

        if (!society) {
            return res.status(404).send({ status: "ERROR", message: "Member not found in the society" });
        }

        res.status(200).send({ status: "OK", message: "Member position updated successfully" });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ status: "ERROR", message: "Internal Server Error" });
    }
};

module.exports = { addMember, deleteMember, acceptMemberApproval, rejectMemberApproval, updateMember };
