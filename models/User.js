const mongoose = require('mongoose');
const USER = require("../enum/accessTypes");

const UserDetailsSchema = new mongoose.Schema(
    {
        fname: String,
        lname: String,
        profilephoto: String, // URL of the image
        gender: String,

        access : { type:Number, default : {USER}}, //User type

        email: { type: String, unique: true },
        bio: String,
        phoneNo: String,
        password: String,
        interests: [String],

        visibility: {
            public: { type: Boolean, default: false },
            userName: { type: Boolean, default: true },
            bio: { type: Boolean, default: true },
            hobbies: { type: Boolean, default: true },
            project: { type: Boolean, default: true },
            branch: { type: Boolean, default: true },
            semester: { type: Boolean, default: true },
            section: { type: Boolean, default: true },
            socialmedia: { type: Boolean, default: true },
            societies: { type: Boolean, default: true }
        },

        socialmedia: {
            //store url
            linkedin: String,
            instagram: String,
            facebook: String,
            github: String,
            website: String
        },

        societies: [String],
        skills: [String],
        hobbies: [String],
        projects: [String]
    },
    {
        collection: "user"
    }
);

// Pass the Model name and the schema to the model
mongoose.model("user", UserDetailsSchema);