require('../../models/Society');
require('../../models/AdminActions.js');
const mongoose = require('mongoose');
const Society = mongoose.model('society');
const AdminActions = mongoose.model('adminactions');
const { ADMIN } = require('../../enum/accessTypes.js');

// Function to approve a society
const approveSociety = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // In case the user is not an admin
        console.log("access check ",req.user.access,"<=",ADMIN)
        if (req.user.access > ADMIN) {
            return res.status(403).send({ status: "FORBIDDEN", message: "USER IS NOT ELIGIBLE FOR APPROVING SOCIETY" });
        }

        const soc_email = req.body.email; // Society's email that has to be verified

        // Create new admin action within the session
        const newAction = new AdminActions({
            adminId: req.user.id,
            action: {
                title: `Society approved ${soc_email}`,
                desc: `A society has been approved`
            },
            on: soc_email
        });
        await newAction.save({ session });

        console.log("New Action:", newAction);

        const newstatus = {
            'approval.status': 'approved',
            'approval.actionId': newAction._id
        };

        // Find the society by email and update the approval status
        const verified = await Society.findOneAndUpdate(
            { email: soc_email },
            { $set: newstatus }, // Update the approval status of the society 
            { new: true, session } // Return the modified document and use the session
        );

        // If society not found, return error
        if (!verified) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).send({ status: "ERROR", message: "Society not found" });
        }

        await session.commitTransaction();
        session.endSession();
        res.status(200).send({ status: "OK", message: "Society has been approved successfully", data: verified });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error:', error);
        res.status(500).send({ status: "ERROR", message: "Internal Server Error" });
    }
};

// Function to refuse a society
const refuseSociety = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // In case the user is not an admin
        if (req.user.access > ADMIN) {
            return res.status(403).send({ status: "FORBIDDEN", message: "USER IS NOT ELIGIBLE FOR MAKING THESE CHANGES" });
        }

        const soc_email = req.body.email; // Society's email that has to be refused

        // Create new admin action within the session
        const newAction = new AdminActions({
            adminId: req.user.id,
            action: {
                title: `Society refused ${soc_email}`,
                desc: `A society has been refused`
            },
            on: soc_email
        });
        await newAction.save({ session });

        console.log("New Action:", newAction);

        // Find the society by email and update the approval status
        const society = await Society.findOneAndUpdate(
            { email: soc_email },
            {
                $set: {
                    'approval.status': 'rejected',
                    'approval.actionId': newAction._id,
                }
            }, // Update the approval status of the society
            { new: true, session } // Return the modified document and use the session
        );

        // If society not found, return error
        if (!society) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).send({ status: "ERROR", message: "Society not found" });
        }

        await session.commitTransaction();
        session.endSession();
        res.status(200).send({ status: "OK", message: "The approval for " + society.name + " has been refused successfully", data: society });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error:', error);
        res.status(500).send({ status: "ERROR", message: "Internal Server Error" });
    }
};

module.exports = { approveSociety, refuseSociety };
