require('../../models/Events');
require('../../models/Society')
const mongoose = require('mongoose');
const { SOCIETY, ADMIN, EVENT_BLOCKED, USER} = require('../../enum/accessTypes');
const Events = mongoose.model('events');
const Society = mongoose.model('society');

//@description     Creating a new event
//@route           POST /api/event/create-event
//@access          Protected -> only society can create an event
const createEvent = async (req, res) => {
    try {
        // Check user's access level
        if (req.user.access !== SOCIETY.FULL_ACCESS && req.user.access > ADMIN) {
            return res.status(403).send({ status: "FORBIDDEN", message: "User is not eligible to create an event" });
        }
        // Check if user is not blocked to create event
        if(req.user.access === EVENT_BLOCKED){
            return res.status(403).send({ status: "FORBIDDEN", message: "User is BLOCKED from creating events" });
        }
    
        const eventData = req.body;
        
        if (!eventData) {
            return res.status(400).send({ status: "BAD_REQUEST", message: "Event data is required" });
        }
        eventData.host = { type: req.user.access, id:req.user.id, email: req.user.email };

        const newEvent = new Events(eventData);
        await newEvent.save();

        res.status(201).send({ status: "CREATED", message: "Event created successfully", data: newEvent });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ status: "ERROR", message: "Internal Server Error" });
    }
};

//@description     Update an existing event
//@route           POST /api/event/update-event
//@access          Protected -> only event creator can update the event
const updateEvent = async (req, res) => {
    try {
        // Check user's access level
        if (req.user.access !== SOCIETY && req.user.access > ADMIN) {
            return res.status(403).send({ status: "FORBIDDEN", message: "User is not eligible to create an event" });
        }

        const { eventId, newData } = req.body;
        newData.host = { type: req.user.access, id:req.user.id, email: req.user.email };

        if (!eventId || !newData) {
            return res.status(400).send({ status: "BAD_REQUEST", message: "Event ID and new data are required, Check data structre from \n API Calls->Events->eventsAPI.txt" });
        }

        const updatedEvent = await Events.findOneAndUpdate({_id:eventId, 'host.id':req.user.id}, newData, { new: true });

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

//@description     Delete an existing event
//@route           POST /api/event/delete-event/?id
//@access          Protected -> only society can create an event
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

        const deletedEvent = await Events.findOneAndDelete({_id:eventId,'host.id':req.user.id});

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
        let events = undefined;
        if(req.user.access === SOCIETY || req.user.access === USER){
            events = await Events.find({ "host.email" : req.body.email, visibility:"public"});
        }
        if(!events){
            const isMember = await Society.findOne({ email:req.body.email, members: { $in: [mongoose.Types.ObjectId(memberId)] }});
            if(isMember){
                events = await Events.find({ "host.email" : req.body.email, visibility:"member"});
            }
            
        }
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


