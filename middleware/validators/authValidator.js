const { body } = require('express-validator');

const registerValidationRules = () => {
  return [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 6 characters long')
  ];
};

const loginValidationRules = () => {
  return [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').not().isEmpty().withMessage('Password cannot be empty'),
    body('type').isIn(['', 'user', 'admin', 'society']).withMessage('Type must be either user, admin, or society')
  ];
};

module.exports = {
  registerValidationRules,
  loginValidationRules
};
