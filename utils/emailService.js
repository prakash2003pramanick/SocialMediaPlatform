// utils/emailService.js
const nodemailer = require('nodemailer');
const secure_configuration = require('../config/mailConfig');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: secure_configuration.EMAIL_USERNAME,
        clientId: secure_configuration.CLIENT_ID,
        clientSecret: secure_configuration.CLIENT_SECRET,
        refreshToken: secure_configuration.REFRESH_TOKEN
    }
});

const sendMail = (mailOptions) => {
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return reject(error);
            }
            resolve(info);
        });
    });
};

module.exports = {
    sendMail
};
