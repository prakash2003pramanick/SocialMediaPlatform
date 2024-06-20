// config/mailConfig.js
require('dotenv').config();

module.exports = {
    EMAIL_USERNAME: process.env.EMAIL_USERNAME,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    REFRESH_TOKEN: process.env.REFRESH_TOKEN
};
