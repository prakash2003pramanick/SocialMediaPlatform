const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth/authController');
const { version } = require('mongoose');
const { registerValidationRules, loginValidationRules } = require('../middleware/validators/authValidator');
const {validate} = require('../middleware/validationMiddleware');

router.post('/register', registerValidationRules(), validate, authController.register);
router.post('/login', loginValidationRules(), validate, authController.login);

// router.post('/register', register); //tested

// router.post('/login', login); //tested

router.post('/register-society', authController.registerSociety); // tested

module.exports = router;

