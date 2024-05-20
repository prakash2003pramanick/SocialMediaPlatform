require('../../models/Admin'); // Import the Admin model
const mongoose = require('mongoose');
const Admin = mongoose.model('admin'); // Use the Admin model
const { SUPERADMIN } = require('../../enum/accessTypes.js');
const bcrypt = require('bcryptjs');

const createAdmin = async (req, res) => {
    try {
        // Check user's access level
        if (req.user.access !== SUPERADMIN) {
            return res.status(403).send({ status: "FORBIDDEN", message: "User is not eligible to create an Admin" });
        }

        const adminData = req.body;
        
        if (!adminData) {
            return res.status(400).send({ status: "BAD_REQUEST", message: "Admin data is required" });
        }

        

        const existingAdmin = await Admin.findOne({email : adminData.email})
        if(existingAdmin){
            return res.status(409).send({ status: "ERROR", message: "Admin email already exist" });
        }
        //hash the admin pass
        adminData.password = await bcrypt.hash(adminData.password, 10);

        const newAdmin = new Admin(adminData);
        await newAdmin.save();

        // Removing the pass field before sending the data for security reasons 
        newAdmin.password = undefined;

        res.status(201).send({ status: "CREATED", message: "Admin created successfully", data: newAdmin });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ status: "ERROR", message: "Internal Server Error" });
    }
};

const updateAdmin = async (req, res) => {
    try {
        // Check user's access level
        if (req.user.access !== SUPERADMIN) {
            return res.status(403).send({ status: "FORBIDDEN", message: "User is not eligible to update an Admin" });
        }

        const { adminId, email, newData } = req.body; 

        // Ensure you have either adminId or email and newData
        if (!adminId && !email) {
            return res.status(400).send({ status: "BAD_REQUEST", message: "Admin ID or email is required" });
        }

        if (!newData) {
            return res.status(400).send({ status: "BAD_REQUEST", message: "New data is required" });
        }

        let updatedAdmin = null;
        newData.password = await bcrypt.hash(newData.password, 10);

        if (adminId) {
            console.log("finding by id")
            updatedAdmin = await Admin.findByIdAndUpdate(adminId, newData, { new: true });
        } else if (email) {
            console.log("finding by email")
            updatedAdmin = await Admin.findOneAndUpdate({ email: email }, newData, { new: true });
        }

        if (!updatedAdmin) {
            return res.status(404).send({ status: "NOT_FOUND", message: "Admin not found" });
        }

        // Removing the password field 
        updatedAdmin.password = undefined;

        res.status(200).send({ status: "OK", message: "Admin updated successfully", data: updatedAdmin });
        console.log("Admin updated successfully! \nAdmin ID: " + (adminId || updatedAdmin._id) + "\nUpdated Admin\n" + updatedAdmin);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ status: "ERROR", message: "Internal Server Error" });
    }
};


const deleteAdmin = async (req, res) => {
    try {
        // Check user's access level
        if (req.user.access !== SUPERADMIN) {
            return res.status(403).send({ status: "FORBIDDEN", message: "User is not eligible to delete an Admin" });
        }

        const adminId = req.params.id; // admin ID is passed in the URL parameter

        if (!adminId && !req.body.email ) {
            return res.status(400).send({ status: "BAD_REQUEST", message: "Admin ID or Email is required" });
        }

        let deletedAdmin = null;
        if(adminId){
            console.log("Finding admin by ID : ", adminId);
            deletedAdmin = await Admin.findByIdAndDelete(adminId);
        }
        else if(req.body.email){
            console.log("finding by email :", req.body.email);
            deletedAdmin = await Admin.findOneAndDelete({email:req.body.email}, {new : true})
        }

        if (!deletedAdmin) {
            return res.status(404).send({ status: "NOT_FOUND", message: "Admin not found" });
        }

        res.status(200).send({ status: "OK", message: "Admin deleted successfully", data: deletedAdmin });
        console.log("Successfully deleted admin : "+ deletedAdmin._id);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ status: "ERROR", message: "Internal Server Error" });
    }
};

const getAdmin = async (req, res) => {
    try {
        // Check user's access level
        if (req.user.access !== SUPERADMIN) {
            return res.status(403).send({ status: "FORBIDDEN", message: "User is not eligible to fetch admin details" });
        }

        let admin = null;      
        if(req.params.id){
            console.log("Finding admin by id");
            admin = await Admin.findById(req.params.id, { password: 0 }); // Find admin by ID
        }
        else if(req.body.email){
            console.log("Finding admin by email");
            admin = await Admin.findOne({ email: req.body.email }, { password: 0 }); // Find admin by email
        }
        

        if (!admin) {
            return res.status(404).send({ status: "NOT_FOUND", message: "Admin not found" });
        }

        // Send the admin data
        res.status(200).send({ status: "OK", data: admin });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ status: "ERROR", message: "Internal Server Error" });
    }
};

const getAllAdmin = async (req, res) => {
    try {
        // Check user's access level
        if (req.user.access !== SUPERADMIN) {
            return res.status(403).send({ status: "FORBIDDEN", message: "User is not eligible to fetch admin details" });
        }
        const admin = await Admin.find({},{ password : 0 });

        if (!admin) {
            return res.status(404).send({ status: "NOT_FOUND", message: "Admin not found" });
        }

        // Send the admin data
        res.status(200).send({ status: "OK", data: admin });

        // Check if reuested for excel file 
        if(req.body.downlaodExcel){
            console.log("Fetching Details")

            console.log("Converting to excel");

            console.log("Sending excel file");
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ status: "ERROR", message: "Internal Server Error" });
    }
};

module.exports = { createAdmin, updateAdmin, deleteAdmin, getAdmin, getAllAdmin};
