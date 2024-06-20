const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/verifyToken');
const { getSocietyProfile, updateSocietyProfile, deleteSocietyProfile } = require('../controllers/society/societyController');
const memberController = require('../controllers/society/memberController');

const { 
    updateSocietyProfileValidationRules, 
    deleteSocietyProfileValidationRules 
} = require('../middleware/validators/societyValidator');

const { 
    addMemberValidationRules,
    deleteMemberValidationRules,
    acceptMemberApprovalValidationRules,
    rejectMemberApprovalValidationRules,
    updateMemberValidationRules 
} = require('../middleware/validators/memberValidator');

const { validate } = require('../middleware/validationMiddleware');

router.use(verifyToken);

// Society-as-a-User related routes
router.get('/get-profile', getSocietyProfile);

router.put('/update-profile', updateSocietyProfileValidationRules(), validate, updateSocietyProfile);

router.delete('/delete-profile', deleteSocietyProfileValidationRules(), validate, deleteSocietyProfile);


router.post('/add-member', addMemberValidationRules(), validate, memberController.addMember);
router.post('/delete-member', deleteMemberValidationRules(), validate, memberController.deleteMember);
router.post('/accept-member-approval', acceptMemberApprovalValidationRules(), validate, memberController.acceptMemberApproval);
router.post('/reject-member-approval', rejectMemberApprovalValidationRules(), validate, memberController.rejectMemberApproval);
router.post('/update-member', updateMemberValidationRules(), validate, memberController.updateMember);

module.exports = router;
