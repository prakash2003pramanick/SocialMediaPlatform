const mongoose = require('mongoose');
const { SOCIETY } = require('../enum/accessTypes.js');

// Destructure `Schema` from `mongoose`
const { Schema } = mongoose;

const SocietiesSchema = new Schema(
    {
        name: String,
        headofsociety: String,
        profilephoto: String, // URL of the image
        type: String, // What type of socity it is ?
        under: String, // Organizaiton / Institue under which the society is registered
        

        access : { type: Number, default: SOCIETY.NOT_APPROVED }, //society type

        email: { type: String, unique: true },
        bio: String,
        password: String,
        interests: [String],

        visibility: {
            public: { type: Boolean, default: false },
            userName: { type: Boolean, default: true },
            bio: { type: Boolean, default: true },
            project: { type: Boolean, default: true },
            socialmedia: { type: Boolean, default: true },
        },

        socialmedia: {
            //store url
            linkedin: String,
            instagram: String,
            facebook: String,
            github: String,
            website: String,
            whatsapp_group : String, // Link of whatsapp group if any
            phone : Number
        },

        members : [{
            id : { type : Schema.Types.ObjectId, unique : true },
            email:String,
            position:{ type:String, default:"Executive" },
        }],

        pendingVerification : [{
            id : { type : Schema.Types.ObjectId },
            email:String,
            position:{ type:String, default:"Executive" },
        }],

        events : [{
            event_id : { type : Schema.Types.ObjectId, ref : "Event"}
        }],

        projects: [{
            name : String,
            creator : String,
            link : String
        }],
    },
    {
        collection: "society"
    }
);

// Pass the Model name and the schema to the model
mongoose.model("society", SocietiesSchema);
