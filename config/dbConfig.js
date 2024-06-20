const mongoose = require('mongoose');
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

const connectDB = async () => {
    mongoose.connect(process.env.mongoUrl, clientOptions).then(() => {
        console.log("Connected to database");
    }).catch(e => console.log(e));
};

module.exports = connectDB;