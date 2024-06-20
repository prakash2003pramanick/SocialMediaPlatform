const mongoose = require('mongoose');
const { Schema } = mongoose;

// Function to convert UTC date to IST
const convertUTCtoIST = (date) => {
    // Get UTC time in milliseconds
    const utcTime = date.getTime();

    // Offset for IST (Indian Standard Time) is UTC + 5.5 hours (5 hours and 30 minutes)
    const istOffset = 5.5 * 60 * 60 * 1000;

    // Add the offset to get IST time
    const istTime = new Date(utcTime + istOffset);

    return istTime;
};

const AdminActionsSchema = new Schema(
    {
        adminId :{ type: Schema.Types.ObjectId , ref: 'admin', required : true},
        action: {
            title: { type: String },
            desc: { type: String },
            date: { type: Date, default: () => convertUTCtoIST(new Date()) } // Use a function to initialize the date field
        },
        on: { type: String , required : true }, // User id on which the action is taken
        lastState : {type: Object}
    },
    {
        collection: 'adminactions'
    }
);

// Pass the Model name and the schema to the model
mongoose.model('adminactions', AdminActionsSchema);
