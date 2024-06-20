const { check } = require('express-validator');

const addMemberValidationRules = () => [
    check('email')
        .isEmail()
        .withMessage('Invalid email format'),
    check('position')
        .isString()
        .withMessage('Position must be a string')
        .notEmpty()
        .withMessage('Position should not be empty')
        .matches(/^[A-Za-z0-9\s]+$/)
        .withMessage('Position should not contain special characters')
];
const deleteMemberValidationRules = () => [
    check('email').isEmail().withMessage('Invalid email format')
];

const acceptMemberApprovalValidationRules = () => [
    check('email').isEmail().withMessage('Invalid email format')
];

const rejectMemberApprovalValidationRules = () => [
    check('email').isEmail().withMessage('Invalid email format')
];

const updateMemberValidationRules = () => [
    check('email').isEmail().withMessage('Invalid email format'),
    check('position').isString().withMessage('Position must be a string')
];

module.exports = {
    addMemberValidationRules,
    deleteMemberValidationRules,
    acceptMemberApprovalValidationRules,
    rejectMemberApprovalValidationRules,
    updateMemberValidationRules
};
