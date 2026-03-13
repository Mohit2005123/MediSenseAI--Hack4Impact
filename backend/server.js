// import express from 'express';
// const { NGROK_DOMAIN } = require('./src/config/env');
// const twilioClient = require('./src/config/twilio');
// const webhookRouter = require('./src/routes/webhook');
// const bodyParser = require('body-parser');
// import path from 'path';

// // Config
// import dotenv from 'dotenv';

// dotenv.config();

// // Routes

// const app = express();

// app.use('/static', express.static(path.join(__dirname, 'public'), {
//   setHeaders: (res, filePath) => {
//     if (filePath.endsWith('.mp3')) {
//       res.setHeader('Content-Type', 'audio/mpeg');
//     }
//   }
// }));

// // Twilio webhooks use x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));

// // Mount routes
// app.use('/', webhookRouter({ twilioClient, ngrokDomain: NGROK_DOMAIN }));

// app.listen(3000, () => {
//   console.log('📡 WhatsApp OCR + Voice Bot running on http://localhost:3000');
// });

const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const { NGROK_DOMAIN } = require('./src/config/env');
const twilioClient = require('./src/config/twilio');
const webhookRouter = require('./src/routes/webhook');

dotenv.config();

const app = express();

app.use(
  '/static',
  express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.mp3')) {
        res.setHeader('Content-Type', 'audio/mpeg');
      }
    }
  })
);

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', webhookRouter({ twilioClient, ngrokDomain: NGROK_DOMAIN }));

app.listen(3000, () => {
  console.log('📡 WhatsApp OCR + Voice Bot running on http://localhost:3000');
});
