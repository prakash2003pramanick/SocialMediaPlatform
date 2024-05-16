const express = require('express');
const router = express.Router();
const { register, login, registerSociety } = require('../controllers/authController');
const { version } = require('mongoose');
const { verify } = require('jsonwebtoken');
const { verifyToken } = require('../middleware/verifyToken');

router.post('/register', register);
/*
method -> post
api -> http://localhost:8000/auth/register
header -> Content-Type : application/json
body ->
{
    "fname":"prakash",
    "lname":"pramanick"
}
*/


router.post('/login', login);
/*
method -> post
api -> http://localhost:8000/auth/login
header -> Content-Type : application/json
body ->
{
    "email":"prakash@gmail.com",
    "password":"123"
}
*/

router.post('/register-society', verifyToken, registerSociety);

module.exports = router;

