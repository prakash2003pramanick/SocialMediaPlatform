const mongoose = require('mongoose');
const { Schema } = mongoose; // Import Schema from mongoose

const EventSchema = new Schema(
    {
        name: String,
        email: String, // event creator email
        host: {
            email: String,
            soc_id: {type : Schema.Types.ObjectId, ref: 'Society'}
        },
        posterphoto: String, // URL of the image
        desc: String,
        phoneNo: String,
        hyperlink: String, // registration link or link to website where the details of event are listed
        visibility: { type: String, default: 'public' }
    },
    {
        collection: 'Event'
    }
);

// Pass the Model name and the schema to the model
mongoose.model('Event', EventSchema);
