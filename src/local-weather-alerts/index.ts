import { sendDiscordMessage } from '../services/discord-service';
import { parseJSONFile, writeJSONFile } from '../services/json-service';
import { WeatherResponse } from '../util/api';

// TODO: set up tests to make sure this works
// Use realistic scenario with multiple different JSON inputs (a watch and 2 separate warnings)

export async function getCurrentLocalAlerts() {
  // For testing, we can grab response from state-wide alerts when there are tornado events:
  // https://api.weather.gov/alerts/active?area=AL
  // https://www.weather.gov/documentation/services-web-api
  // const localAlertsRes = await client<WeatherResponse>(`https://api.weather.gov/alerts/active?point=${appConfig.coordinates}`, 'GET');
  // writeFileSync('sample_res.json', localAlertsRes.data as any)
  const localAlertsRes = {
    data: await parseJSONFile<WeatherResponse>('sample_res.json')
  };
  const localAlerts = localAlertsRes.data.features;
  const staleAlerts = await parseJSONFile<{ alertIds: string[] }>(
    'stale_alerts.json'
  );
  for (const alert of localAlerts) {
    // The alert event, e.g. Tornado Warnning
    // Primary field to filter for tornado watch/warning
    const event = alert.properties.event;
    // Short description of what we can send via text
    // E.g. X warning issued until y for counties z
    const headline = alert.properties.headline;
    // I have a Tornado Watch sample in the json sample file too
    if (event.toLowerCase().includes('tornado')) {
      if (!staleAlerts.alertIds.includes(alert.id)) {
        // await sendTwilioText(headline);
        sendDiscordMessage(headline);
        staleAlerts.alertIds.push(alert.id);
        await writeJSONFile('stale_alerts.json', staleAlerts);
      } else {
        console.log('Old alert, still active, skipping.');
      }
    }
  }
}

export async function clearStaleAlerts() {
  await writeJSONFile('stale_alerts.json', { alertIds: [] });
}
