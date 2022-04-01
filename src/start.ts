import { readFileSync } from 'fs';
import twilio from 'twilio';
import { WeatherResponse } from './api';
import { appConfig } from "./config";

// TODO: set up for every hour checks for tornado watch, ever minute checks for tornado warning, etc

const twilioClient = twilio(appConfig.twilio.accoundSid, appConfig.twilio.accountToken)

async function getCurrentLocalAlerts() {
  // For testing, we can grab response from state-wide alerts when there are tornado events:
  // https://api.weather.gov/alerts/active?area=AL
  // https://www.weather.gov/documentation/services-web-api
  // const localAlertsRes = await client<WeatherResponse>(`/alerts/active?point=${appConfig.coordinates}`, 'GET');
  // writeFileSync('sample_res.json', localAlertsRes.data as any)
  const localAlertsRes = {data: JSON.parse(readFileSync('sample_res.json') as any) as unknown as WeatherResponse};
  const title = localAlertsRes.data.title;
  const localAlerts = localAlertsRes.data.features;
  for (const alert of localAlerts) {
    const effective = alert.properties.effective;
    const expires = alert.properties.expires;
    const severity = alert.properties.severity;
    const certainty = alert.properties.certainty;
    const urgency = alert.properties.urgency;
    // The alert event, e.g. High Surf Warning
    // Primary field to filter for tornado warning
    const event = alert.properties.event;
    // Short description of what we can send via text
    // E.g. X warning issued until y for counties z
    const headline = alert.properties.headline;
    // Detailed description
    const description = alert.properties.description;
    // Detailed instructions
    const instruction = alert.properties.instruction;
    // I have a Tornado Watch sample in the json sample file too
    if (event === 'Tornado Warning') {
      const twilioRes = await sendTwilioText(headline);
      console.log(twilioRes);
    }
  }
}

async function sendTwilioText(message: string) {
  const twilioRes = twilioClient.messages.create({
    body: message,
    from: appConfig.twilio.phoneNumber,
    to: appConfig.cellPhoneNumber
  })
  return twilioRes;
}

getCurrentLocalAlerts();
