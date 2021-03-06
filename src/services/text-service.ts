import twilio from 'twilio';
import { appConfig } from '../util/config';

// NOTE: Switched to discord, no longer using twilio, left here for posterity.
const twilioClient = twilio(
  appConfig.twilio.accoundSid,
  appConfig.twilio.accountToken
);

export async function sendTwilioText(message: string) {
  const twilioRes = twilioClient.messages.create({
    body: message,
    from: appConfig.twilio.phoneNumber,
    to: appConfig.cellPhoneNumber
  });
  return twilioRes;
}
