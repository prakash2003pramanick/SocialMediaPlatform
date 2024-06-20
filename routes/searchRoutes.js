const express = require('express');
const router = express.Router();
const { searchUserProfile } = require('../controllers/search/searchUserController');
const { searchSocietyProfile } = require('../controllers/search/searchSocietyController');
const { verifyToken } = require('../middleware/verifyToken');
const { searchValidationRules } = require('../middleware/validators/searchValidator');
const { validate } = require('../middleware/validationMiddleware');

router.get('/user', verifyToken, searchValidationRules(), validate, searchUserProfile);
router.get('/society', verifyToken, searchValidationRules(), validate, searchSocietyProfile);

module.exports = router;
