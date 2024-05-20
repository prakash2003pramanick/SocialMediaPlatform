// const mongoose = require('mongoose');

// // Destructure `Schema` from `mongoose`
// const { Schema } = mongoose;

// // Function to convert UTC date to IST
// const convertUTCtoIST = (date) => {
//     // Get UTC time in milliseconds
//     const utcTime = date.getTime();

//     // Offset for IST (Indian Standard Time) is UTC + 5.5 hours (5 hours and 30 minutes)
//     const istOffset = 5.5 * 60 * 60 * 1000;

//     // Add the offset to get IST time
//     const istTime = new Date(utcTime + istOffset);

//     return istTime;
// };

// const AdminActionsSchema = new Schema(
//     {
//         email : { type: Schema.Types.ObjectId, ref : 'Admin' }, // admin email

//         actions : [{ 
//             title : { type: String },
//             desc : { type: String },
//             date : { type: Date, default: () => convertUTCtoIST(new Date()) } // Use a function to initialize the date field
//          }],

//         on : { type: String } // User id on which the action is taken
//     },
//     {
//         collection: "AdminActions"
//     }
// );

// // Pass the Model name and the schema to the model
// mongoose.model("AdminActions", AdminActionsSchema);
