const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middleware/verifyToken');
const { getSocietyProfile, updateSocietyProfile, deleteSocietyProfile } = require('../controllers/societyController');

// Society-as-a-User related routes
router.get('/get-profile', verifyToken, getSocietyProfile);

router.put('/update-profile', verifyToken, updateSocietyProfile);

router.delete('/delete-profile', verifyToken, deleteSocietyProfile);


// Society-membership related routes
// router.get('/get-members', verifyToken, getMembers);

// router.put('/verify-member', verifyToken, verifyMember);
// router.put('/update-member', verifyToken, verifyMember);
// router.put('/add-member', verifyToken, verifyMember);
// router.delete('/remove-member', verifyToken, deleteMember);


module.exports = router;

