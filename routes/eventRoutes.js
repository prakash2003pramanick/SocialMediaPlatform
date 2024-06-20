const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event/eventControllers');
const { verifyToken } = require('../middleware/verifyToken');
const { 
    createEventValidationRules, 
    updateEventValidationRules, 
    deleteEventValidationRules, 
    fetchEventsValidationRules 
} = require('../middleware/validators/eventValidator');
const { validate } = require('../middleware/validationMiddleware');

router.use(verifyToken);
// Society-as-a-Event_Creator related routes
router.post('/create-event', createEventValidationRules(), validate, eventController.createEvent);
router.post('/update-event', updateEventValidationRules(), validate, eventController.updateEvent);
router.delete('/delete-event/:id', deleteEventValidationRules(), validate, eventController.deleteEvent);
router.post('/fetch-events', fetchEventsValidationRules(), validate, eventController.getEvents);

module.exports = router;
