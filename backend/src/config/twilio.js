const twilio = require('twilio');
const { TWILIO_SID, TWILIO_AUTH_TOKEN } = require('./env');

const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

module.exports = client;


