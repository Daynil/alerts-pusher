import { readFileSync } from 'fs';
import { WeatherResponse } from './api';
import { sendTwilioText } from './text-service';

// TODO: set up for every hour checks for tornado watch, ever minute checks for tornado warning, etc
// TODO: set up tests to make sure this works
// Use realistic scenario with multiple different JSON inputs (a watch and 2 separate warnings)
// TODO: how does the twilio trial phone # issue affect this? Get new # every time I start this? Other API? Don't want to pay $1 monthly for a #
// TODO: (sendgrid setup) send an email if text fails for some reason.

const alertsNotified = [];

async function getCurrentLocalAlerts() {
  // For testing, we can grab response from state-wide alerts when there are tornado events:
  // https://api.weather.gov/alerts/active?area=AL
  // https://www.weather.gov/documentation/services-web-api
  // const localAlertsRes = await client<WeatherResponse>(`/alerts/active?point=${appConfig.coordinates}`, 'GET');
  // writeFileSync('sample_res.json', localAlertsRes.data as any)
  const localAlertsRes = {data: JSON.parse(readFileSync('sample_res.json') as any) as unknown as WeatherResponse};
  const localAlerts = localAlertsRes.data.features;
  for (const alert of localAlerts) {
    // The alert event, e.g. High Surf Warning
    // Primary field to filter for tornado watch/warning
    const event = alert.properties.event;
    // Short description of what we can send via text
    // E.g. X warning issued until y for counties z
    const headline = alert.properties.headline;
    // I have a Tornado Watch sample in the json sample file too
    if (event === 'Tornado Warning' || event === 'Tornado Watch') {
      if (!alertsNotified.includes(alert.id)) {
        await sendTwilioText(headline);
        alertsNotified.push(alert.id)
      } else {
        console.log('Old alert, still active, skipping.');
      }
    }
  }
}

getCurrentLocalAlerts();
