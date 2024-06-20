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

module.exports = convertUTCtoIST;