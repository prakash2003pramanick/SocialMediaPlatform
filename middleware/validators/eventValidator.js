const { body, param } = require('express-validator');

const createEventValidationRules = () => {
    return [
        body('name').notEmpty().withMessage('Name is required'),
        // body('description').notEmpty().withMessage('Description is required'),
        // body('date').isISO8601().withMessage('Date must be in ISO8601 format'),
        // body('visibility').isIn(['public', 'private', 'member']).withMessage('Visibility must be public, private, or member'),
    ];
};

const updateEventValidationRules = () => {
    return [
        body('eventId').notEmpty().withMessage('Event ID is required'),
        body('newData').notEmpty().withMessage('New data is required'),
    ];
};

const deleteEventValidationRules = () => {
    return [
        param('id').notEmpty().withMessage('Event ID is required'),
    ];
};

const fetchEventsValidationRules = () => {
    return [
        body('email').isEmail().withMessage('Valid email is required'),
    ];
};

module.exports = {
    createEventValidationRules,
    updateEventValidationRules,
    deleteEventValidationRules,
    fetchEventsValidationRules,
};
