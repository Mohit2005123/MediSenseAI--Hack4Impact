require('dotenv').config();

const requiredEnvVars = [
  'TWILIO_SID',
  'TWILIO_AUTH_TOKEN',
  'NGROK_DOMAIN',
  'GROQ_API_KEY',
  'SARVAM_API_KEY'
];

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    // Log a warning instead of throwing to allow partial local development
    console.warn(`[env] Missing environment variable: ${key}`);
  }
}

module.exports = {
  TWILIO_SID: process.env.TWILIO_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  NGROK_DOMAIN: process.env.NGROK_DOMAIN,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  SARVAM_API_KEY: process.env.SARVAM_API_KEY
};


