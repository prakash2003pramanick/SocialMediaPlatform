const mongoose = require('mongoose');
const convertUTCtoIST = require('../utils/date')
const { Schema } = mongoose; // Import Schema from mongoose

const EventsSchema = new Schema(
    {
        name: String,
        host: {
            type:{
                type:Number,
            },
            id:{type:Schema.Types.ObjectId, ref:'socoiety'},
            email: String,
            created_on : {type : Date, default: () => convertUTCtoIST(new Date())},
        },
        posterphoto: String, // URL of the image
        desc: String,
        date_of_event : {type : Date, default: () => convertUTCtoIST(new Date())},
        poc:{
            name:String,
            phoneNo: String,
            email:String,
        },
        hyperlink: String, // registration link or link to website where the details of event are listed
        visibility: { type: String, default: 'public' , enum : ['public', 'members', 'private']},
        tags:[String],
        status : {type : String, default : "UPCOMING"}
    },
    {
        collection: 'events'
    }
);

// Pass the Model name and the schema to the model
mongoose.model('events', EventsSchema);
