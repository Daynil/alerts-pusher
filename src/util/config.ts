import dotenv from 'dotenv';
dotenv.config();

/**
 * App specific config goes under app name.
 * Shared config goes in base object.
 */
export const appConfig = {
  coordinates: process.env.COORDINATES,
  cellPhoneNumber: process.env.CELL_PHONE_NUMBER,
  twilio: {
    accoundSid: process.env.TWILIO_ACCOUNT_SID,
    accountToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY
  },
  discord: {
    botToken: process.env.DISCORD_BOT_TOKEN,
    hookUrl: process.env.DISCORD_HOOK_URL
  }
};
