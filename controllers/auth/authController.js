const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('../../models/User');
require('../../models/Society');
const mongoose = require("mongoose");
const { USER, SOCIETY} = require('../../enum/accessTypes')

//@description     Register a user
//@route           POST /api/uth/register
//@access          Not Protected
const register = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    console.log(password);
    const User = mongoose.model("user");

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Ensure access level is set to USER and remove it from request body
        const access = USER;
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const user = await User.create({
            ...req.body,
            access,
            password: hashedPassword
        });

        // Generate the JWT Token
        const token = jwt.sign({ email, access, id: user._id }, process.env.JWT_SECRET);
        console.log(token);

        res.status(201).json({ message: 'User created successfully', data: token });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//@description     Register a Society
//@route           POST /api/uth/login
//@access          Protected -> only existing users can login
const login = async (req, res) => {
    console.log(req.body)
    let { type, email, password} = req.body;
    if(!type){
        type = "user"
    }
    if(!type || !email || !password){
        console.log("type : ",type);
        console.log("email : ",email);
        console.log("password : ",password);
        return res.status(400).json({ error: 'Missing required fields : type, email or password' });
    }
    console.log(type);
    console.log(email);
    console.log(password);

    try {

        const model = mongoose.model(type);
        const user = await model.findOne({ email : {'$eq':req.body.email} }, '_id access password');
        // console.log("User details ", user);
        // console.log("useraccess is "+user.access);

        if (!user) {
            console.log("user not found");
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        
        //generate the JWT Token
        const token = jwt.sign({ email, access : user.access, id : user._id}, process.env.JWT_SECRET);
        console.log(token);
        return res.send({ status: "OK", message:"LOGGED IN", data:token });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//@description     Register a Society
//@route           POST /api/uth/register-society
//@access          Not Protected
const registerSociety = async (req, res) => {
    const { email, password } = req.body;
    
    // Check if the user has the necessary access level to register a society
    // if (req.user.access !== 0) {
    //     return res.status(403).json({ error: 'Insufficient privileges to register a society' });
    // }

    const Society = mongoose.model('society');
    try {
        const existingSociety = await Society.findOne({ email });

        if (existingSociety) {
            return res.status(400).json({ error: 'Society already exists' });
        }

        // Ensure access level is set to USER and remove it from request body
        const access = SOCIETY.NOT_APPROVED;


        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new society with the request body and hashed password
        const newSociety = new Society({
            ...req.body,
            access,
            password: hashedPassword
        });

        await newSociety.save();

        res.status(201).json({ message: 'Society created successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { register, login, registerSociety };

