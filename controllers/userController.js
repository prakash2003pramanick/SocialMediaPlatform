require('../models/User');
const mongoose = require("mongoose");
const User = mongoose.model("UserInfo");

const getUserProfile = async (req, res) => {
    //const { token } = req.headers.authorization;
    //console.log(req.body);
    try {
        const email = req.user.email;
        console.log("email after verifyToken :"+email);
        User.findOne({ email }).then((data) => {
            if (data) {
                const response = {
                    status: "OK",
                    data: {
                        fullName: data.fname.concat(" ", data.lname),
                        email: data.email
                    }
                };
                res.send(response);
            } else {
                res.send({ status: "ERROR", message: "User not found" });
            }
        }).catch((error) => {
            res.send({ status: "ERROR", message: error.message });
        });
    } catch (error) {
        res.send({ status: "ERROR", message: "JWT verification failed" });
    }
}
const updateUserProfile = async (req, res) => {
    try {
        const email = req.user.email;
        const { fname, lname, phoneNo, interests, visibility, socialmedia } = req.body;

        // Fetch the updated from the request body
        const updateData = {};
        if (fname) updateData.fname = fname;
        if (lname) updateData.lname = lname;
        if (phoneNo) updateData.phoneNo = phoneNo;
        if (interests) updateData.interests = interests;
        if (visibility) updateData.visibility = visibility;
        if (socialmedia) updateData.socialmedia = socialmedia;

        // Find the user by email and update the profile
        const updatedUser = await User.findOneAndUpdate(
            { email },
            updateData,
            { new: true } // Return the updated user data
        );

        if (!updatedUser) {
            return res.status(404).send({ status: "ERROR", message: "User not found" });
        }

        res.status(200).send({ status: "OK", message: "User profile updated successfully", data: updatedUser });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ status: "ERROR", message: "Internal Server Error" });
    }
};


const deleteUserProfile = async (req, res) => {
    try {
        const email = req.user.email;
        const deletedUser = await User.findOneAndDelete({ email });

        if (!deletedUser) {
            return res.status(404).send({ status: "ERROR", message: "User not found" });
        }

        res.status(200).send({ status: "OK", message: "User deleted successfully", data: deletedUser });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ status: "ERROR", message: "Internal Server Error" });
    }
};


module.exports = { getUserProfile, updateUserProfile, deleteUserProfile };

