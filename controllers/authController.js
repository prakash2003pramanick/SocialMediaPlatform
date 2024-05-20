const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('../models/User');
require('../models/Society');
const mongoose = require("mongoose");


const register = async (req, res) => {
    //const { fname, lname, profilephoto, gender, email, bio, phoneNo, password, interests, visibility, socialmedia, societies, skills, hobbies, projects } = req.body;
    const { email, password } = req.body;
    console.log(req.body)
    console.log(password)
    const User = mongoose.model("UserInfo");
    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // const newUser = new User({
        //     fname,
        //     lname,
        //     profilephoto,
        //     gender,
        //     email,
        //     bio,
        //     phoneNo,
        //     password: hashedPassword,
        //     interests,
        //     visibility,
        //     socialmedia,
        //     societies,
        //     skills,
        //     hobbies,
        //     projects
        // });

        // await newUser.save();

        User.create({
            ...req.body,
            access,
            password : hashedPassword
        });

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const login = async (req, res) => {
    const { type, email, password} = req.body;
    if(!type || !email || !password){
        return res.status(400).json({ error: 'Missing required fields : type, email, password' });
    }
    console.log(type);
    console.log(email);
    console.log(password);
    const model = mongoose.model(type);

    try {
        const user = await model.findOne({ email }, 'access password');
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
        const token = jwt.sign({ email, access : user.access }, process.env.JWT_SECRET);
        console.log(token);
        return res.send({ status: "OK", message:"LOGGED IN", data:token });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const registerSociety = async (req, res) => {
    const { name, headofsociety, profilephoto, type, email, bio, under, password, interests, visibility, socialmedia, members, events, projects } = req.body;
    
    // Check if the user has the necessary access level to register a society
    if (req.user.access !== 0) {
        return res.status(403).json({ error: 'Insufficient privileges to register a society' });
    }

    const Society = mongoose.model('Society');
    try {
        const existingSociety = await Society.findOne({ email });

        if (existingSociety) {
            return res.status(400).json({ error: 'Society already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newSociety = new Society({
            name,
            headofsociety,
            profilephoto,
            type,
            under,
            email,
            bio,
            password: hashedPassword,
            interests,
            visibility,
            socialmedia,
            members,
            events,
            projects
        });

        await newSociety.save();

        res.status(201).json({ message: 'Society created successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { register, login, registerSociety };

