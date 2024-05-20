const express = require('express');
const router = express.Router();
// const { createEvent, updateEvent, deleteEvent, getEvents } = require('../controllers/eventControllers');
const { createEvent, updateEvent, deleteEvent, getEvents } = require('../controllers/eventControllers');
const { verifyToken } = require('../middleware/verifyToken');

// Scociety-as-a-Event_Creator related routes
router.post('/create-event', verifyToken, createEvent);
router.post('/update-event', verifyToken, updateEvent);
router.delete('/delete-event/:id', verifyToken, deleteEvent);
router.post('/fetch-events', verifyToken, getEvents);

module.exports = router;