import twilio from 'twilio';
import { appConfig } from "./config";

const twilioClient = twilio(appConfig.twilio.accoundSid, appConfig.twilio.accountToken)

export async function sendTwilioText(message: string) {
  const twilioRes = twilioClient.messages.create({
    body: message,
    from: appConfig.twilio.phoneNumber,
    to: appConfig.cellPhoneNumber
  })
  return twilioRes;
}