const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const { TWILIO_SID, TWILIO_AUTH_TOKEN, NGROK_DOMAIN } = require('../config/env');

async function downloadTwilioMedia(url, fileName) {
  const res = await fetch(url, {
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${TWILIO_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')
    }
  });
  const buffer = await res.buffer();
  const filePath = path.join(__dirname, '../../public', fileName);
  fs.writeFileSync(filePath, buffer);
  return `${NGROK_DOMAIN}/static/${fileName}`;
}

module.exports = { downloadTwilioMedia };


