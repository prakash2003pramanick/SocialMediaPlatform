const mongoose = require('mongoose');
const { ADMIN } = require('../enum/accessTypes.js');

// Destructure `Schema` from `mongoose`
const { Schema } = mongoose;

const AdminSchema = new Schema(
    {
        username : String, // admin type
        name: String,   // name of the admin
        profilephoto: String,

        access : { type: Number, default: ADMIN },
        email: { type: String, unique: true },
        personal_email: { type: String },
        role: [String],
        password: String,

        visibility: {
            public: { type: Boolean, default: false },
            username: { type: Boolean, default: true },
            personl_email: { type: Boolean, default: false },
        },

        actions : [{ type : Schema.Types.ObjectId, ref : "adminactions" }],
    },
    {
        collection: "admin"
    }
);

// Pass the Model name and the schema to the model
mongoose.model("admin", AdminSchema);
