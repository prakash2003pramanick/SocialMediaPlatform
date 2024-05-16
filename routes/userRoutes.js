const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, deleteUserProfile } = require('../controllers/userController');
const {verifyToken} = require('../middleware/verifyToken');



// User-related routes
router.get('/get-profile', verifyToken, getUserProfile);

router.put('/update-profile', verifyToken, updateUserProfile);


router.delete('/delete-profile', verifyToken, deleteUserProfile);

module.exports = router;

    