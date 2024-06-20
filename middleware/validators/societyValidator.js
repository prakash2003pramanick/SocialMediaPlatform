const { check } = require('express-validator');

const updateSocietyProfileValidationRules = () => [
    check('name').optional().isString().withMessage('Name must be a string'),
    check('description').optional().isString().withMessage('Description must be a string'),
    check('contactEmail').optional().isEmail().withMessage('Invalid email format')
];

const deleteSocietyProfileValidationRules = () => [
    check('email').isEmail().withMessage('Invalid email format')
];

module.exports = {
    updateSocietyProfileValidationRules,
    deleteSocietyProfileValidationRules
};
