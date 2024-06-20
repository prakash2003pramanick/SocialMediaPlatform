require('../../models/Admin'); // Import the Admin model
require('../../models/AdminActions'); // Import the Admin model
const { sendMail } = require('../../utils/emailService');
const secure_configuration = require('../../config/mailConfig');
const mongoose = require('mongoose');
const Admin = mongoose.model('admin');
const AdminActions = mongoose.model('adminactions');
const { SUPERADMIN, ADMIN} = require('../../enum/accessTypes.js');
const bcrypt = require('bcryptjs');

//@description     Register a user
//@route           POST /api/admin/create-admin
//@access          Not Protected
const createAdmin = async (req, res) => {
    // Creating session for the transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Check user's access level
        if (req.user.access !== SUPERADMIN) {
            return res.status(403).send({ status: "FORBIDDEN", message: "User is not eligible to create an Admin" });
        }

        const password = req.body.password;

        // Create a copy of req.body to avoid modifying the original object
        const adminData = req.body;
        if(!adminData.access){
            adminData.access = ADMIN;
        }

        if (!adminData) {
            return res.status(400).send({ status: "BAD_REQUEST", message: "Admin data is required" });
        }

        //check if the admin already exist
        const existingAdmin = await Admin.findOne({ email: { $eq: adminData.email } });
        if (existingAdmin) {
            return res.status(409).send({ status: "ERROR", message: "Admin email already exists" });
        }

        // Hash the admin password
        adminData.password = await bcrypt.hash(adminData.password, 10);

        // Create new admin within the session
        const newAdmin = new Admin(adminData);
        await newAdmin.save({ session });

        // Remove the password field before sending the data for security reasons
        newAdmin.password = undefined;

        // Create new adminaction within the session
        const newAction = new AdminActions({
            adminId: req.user.id,
            action: {
                title: `Admin Created ${newAdmin.email}`,
                desc: `A new Admin has been created of type ${adminData.access}`
            },
            on: newAdmin.email
        });
        await newAction.save({ session });
        console.log("Admin Created Successfully");

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        // Set up mail configurations
        const mailConfigurations = {
            from: secure_configuration.EMAIL_USERNAME,
            to: newAdmin.personal_email,
            subject: 'Admin Access of the Social Media Platform',
            text: `Hello ${newAdmin.name} !!\n\n You are now Admin of social media platform your credentials are \n Email : ${newAdmin.email}\n Password : ${password}`
        };
        
        // Send email
        try {
            const emailInfo = await sendMail(mailConfigurations);
            console.log('Email Sent Successfully', emailInfo);
            res.status(201).send({ status: "CREATED", message: "Admin created successfully", data: newAdmin });
        } catch (emailError) {
            console.error('Email Sending Error:', emailError);
            res.status(502).send({ status: "BAD_GATEWAY", message: "Admin created but failed to send email notification" });
        }
    } catch (error) {
        console.error('Error:', error);

        // Abort the transaction and rollback the changes
        await session.abortTransaction();
        session.endSession();

        res.status(500).send({ status: "ERROR", message: "Internal Server Error" });
    }
};


const updateAdmin = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Check user's access level
        if (req.user.access !== SUPERADMIN) {
            return res.status(403).send({ status: "FORBIDDEN", message: "User is not eligible to update an Admin" });
        }

        const { adminId, email, newData } = req.body;
        let { desc } = req.body;
        if (!desc) {
            desc = 'Updating admin';
        }

        // Ensure you have either adminId or email and newData
        if (!adminId && !email) {
            return res.status(400).send({ status: "BAD_REQUEST", message: "Admin ID or email is required" });
        }

        if (!newData) {
            return res.status(400).send({ status: "BAD_REQUEST", message: "New data is required" });
        }

        // Fetch the current state of the admin before updating
        let currentAdmin;
        if (adminId) {
            currentAdmin = await Admin.findById(adminId).session(session);
        } else if (email) {
            currentAdmin = await Admin.findOne({ email: email }).session(session);
        }

        if (!currentAdmin) {
            return res.status(404).send({ status: "NOT_FOUND", message: "Admin not found" });
        }

        // Remove the password field before saving the previous state
        const { _id, password, ...adminWithoutPassword } = currentAdmin.toObject();

        // Hash the new password
        newData.password = await bcrypt.hash(newData.password, 10);

        // Update the admin
        let updatedAdmin;
        if (adminId) {
            updatedAdmin = await Admin.findByIdAndUpdate(adminId, newData, { new: true, session });
        } else if (email) {
            updatedAdmin = await Admin.findOneAndUpdate({ email: email }, newData, { new: true, session });
        }

        // Removing the password field from the response
        updatedAdmin.password = undefined;

        // Create new admin action within the session
        const newAction = new AdminActions({
            adminId: req.user.id,
            action: {
                title: `Admin Updated: ${updatedAdmin.email}`,
                desc
            },
            on: updatedAdmin.email,
            lastState: adminWithoutPassword // store the previous state
        });
        await newAction.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.status(200).send({ status: "OK", message: "Admin updated successfully", data: updatedAdmin });
    } catch (error) {
        console.error('Error:', error);

        // Abort the transaction and rollback the changes
        await session.abortTransaction();
        session.endSession();

        res.status(500).send({ status: "ERROR", message: "Internal Server Error" });
    }
};



const deleteAdmin = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Check user's access level
        if (req.user.access !== SUPERADMIN) {
            return res.status(403).send({ status: "FORBIDDEN", message: "User is not eligible to delete an Admin" });
        }

        const adminId = req.params.id; // admin ID is passed in the URL parameter

        if (!adminId && !req.body.email) {
            return res.status(400).send({ status: "BAD_REQUEST", message: "Admin ID or Email is required" });
        }

        let deletedAdmin = null;
        if (adminId) {
            deletedAdmin = await Admin.findByIdAndDelete(adminId, { session });
        } else if (req.body.email) {
            deletedAdmin = await Admin.findOneAndDelete({ email: req.body.email }, { session });
        }

        if (!deletedAdmin) {
            return res.status(404).send({ status: "NOT_FOUND", message: "Admin not found" });
        }
        else{
            deletedAdmin.password = undefined;
        }

        // Create new admin action within the session
        const newAction = new AdminActions({
            adminId : req.user.id,
            email: req.user.email,
            action: {
                title: "Admin Deletion",
                desc: `Admin with email ${deletedAdmin.email} has been deleted`
            },
            on: deletedAdmin.email,
            lastState: deletedAdmin
        });
        await newAction.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.status(200).send({ status: "OK", message: "Admin deleted successfully", data: deletedAdmin });
    } catch (error) {
        console.error('Error:', error);

        // Abort the transaction and rollback the changes
        await session.abortTransaction();
        session.endSession();

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

const getAdminActions = async (req, res) => {
    try {
        // Check user's access level
        if (req.user.access !== SUPERADMIN) {
            return res.status(403).send({ status: "FORBIDDEN", message: "User is not eligible to fetch admin action details" });
        }
        const adminActions = await AdminActions.find({adminId:req.body.id});

        if (!adminActions) {
            return res.status(404).send({ status: "NOT_FOUND", message: "No record found" });
        }

        // Send the admin data
        res.status(200).send({ status: "OK", data: adminActions });

        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ status: "ERROR", message: "Internal Server Error" });
    }
};

    module.exports = { createAdmin, updateAdmin, deleteAdmin, getAdmin, getAllAdmin, getAdminActions};
