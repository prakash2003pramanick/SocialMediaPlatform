require('../models/Events');
const mongoose = require('mongoose');
const { SOCIETY, ADMIN} = require('../enum/accessTypes');
const Events = mongoose.model('events');

const createEvent = async (req, res) => {
    try {
        // Check user's access level
        if (req.user.access !== SOCIETY && req.user.access > ADMIN) {
            return res.status(403).send({ status: "FORBIDDEN", message: "User is not eligible to create an event" });
        }

        const eventData = req.body;
        eventData.host = { type: req.user.access, email: req.user.email };
        
        if (!eventData) {
            return res.status(400).send({ status: "BAD_REQUEST", message: "Event data is required" });
        }

        const newEvent = new Events(eventData);
        await newEvent.save();

        res.status(201).send({ status: "CREATED", message: "Event created successfully", data: newEvent });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ status: "ERROR", message: "Internal Server Error" });
    }
};

const updateEvent = async (req, res) => {
    try {
        // Check user's access level
        if (req.user.access !== SOCIETY && req.user.access > ADMIN) {
            return res.status(403).send({ status: "FORBIDDEN", message: "User is not eligible to create an event" });
        }

        const { eventId, newData } = req.body;

        if (!eventId || !newData) {
            return res.status(400).send({ status: "BAD_REQUEST", message: "Event ID and new data are required, Check data structre from \n API Calls->Events->eventsAPI.txt" });
        }

        const updatedEvent = await Events.findByIdAndUpdate(eventId, newData, { new: true });

        if (!updatedEvent) {
            return res.status(404).send({ status: "NOT_FOUND", message: "Event not found" });
        }

        res.status(200).send({ status: "OK", message: "Event updated successfully", data: updatedEvent });
        console.log("Event updated successfully ! \nEventID : "+eventId+"\nUpdated Event\n"+updatedEvent);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ status: "ERROR", message: "Internal Server Error" });
    }
};

const deleteEvent = async (req, res) => {
    try {
        // Check user's access level
        if (req.user.access !== SOCIETY && req.user.access > ADMIN) {
            return res.status(403).send({ status: "FORBIDDEN", message: "User is not eligible to create an event" });
        }

        const eventId = req.params.id; // event ID is passed in the URL parameter

        if (!eventId) {
            return res.status(400).send({ status: "BAD_REQUEST", message: "Event ID is required" });
        }

        const deletedEvent = await Events.findByIdAndDelete(eventId);

        if (!deletedEvent) {
            return res.status(404).send({ status: "NOT_FOUND", message: "Event not found" });
        }

        res.status(200).send({ status: "OK", message: "Event deleted successfully", data: deletedEvent });
        console.log("Successfully deleted event : "+ deletedEvent._id);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ status: "ERROR", message: "Internal Server Error" });
    }
};

const getEvents = async (req, res) => {
    try {
        // Check user's access level
        if (req.user.access !== SOCIETY && req.user.access > ADMIN) {
            return res.status(403).send({ status: "FORBIDDEN", message: "User is not eligible to fetch event details" });
        }      

        const events = await Events.find({ "host.email" : req.body.email });
    
        // Check if events are found
        if (!events || events.length === 0) {
            return res.status(404).send({ status: "NOT_FOUND", message: "No events found." });
        }

        // Send the events data
        res.status(200).send({ status: "OK", data: events });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ status: "ERROR", message: "Internal Server Error" });
    }
};

// module.exports = { getEvents, updateEvent, deleteEvent, createEvent };
module.exports = { createEvent, updateEvent, deleteEvent, getEvents};


