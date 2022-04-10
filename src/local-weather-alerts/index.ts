import { sendDiscordMessage } from '../services/discord-service';
import { parseJSONFile, writeJSONFile } from '../services/json-service';
import { client, WeatherResponse } from '../util/api';

export const baseUrl = 'https://api.weather.gov';

export async function getCurrentLocalAlerts(alertsContaining = 'tornado') {
  // For testing, we can grab response from state-wide alerts when there are tornado events:
  // https://api.weather.gov/alerts/active?area=AL
  // https://www.weather.gov/documentation/services-web-api
  const localAlertsRes = await client<WeatherResponse>(
    // `${baseUrl}/alerts/active?point=${appConfig.coordinates}`,
    `${baseUrl}/alerts/active?area=FL`,
    'GET'
  );
  // writeFileSync('sample_res.json', localAlertsRes.data as any)
  // const localAlertsRes = {
  //   data: await parseJSONFile<WeatherResponse>('sample_res.json')
  // };

  const localAlerts = localAlertsRes.data.features;
  // File changes at runtime, need to reparse for each call (can't import)
  const staleAlerts = await parseJSONFile<{ alertIds: string[] }>(
    'stale_alerts.json'
  );

  const alertsToInform = [];
  for (const alert of localAlerts) {
    // The alert event, e.g. Tornado Warnning
    // Primary field to filter for tornado watch/warning
    const event = alert.properties.event;
    // Short description of what we can send via text
    // E.g. X warning issued until y for counties z
    const headline = alert.properties.headline;
    // I have a Tornado Watch sample in the json sample file too
    if (event.toLowerCase().includes(alertsContaining)) {
      if (!staleAlerts.alertIds.includes(alert.id)) {
        alertsToInform.push(headline);
        staleAlerts.alertIds.push(alert.id);
        await writeJSONFile('stale_alerts.json', staleAlerts);
      } else {
        console.log('Old alert, still active, skipping.');
      }
    }
  }

  if (alertsToInform.length) {
    sendDiscordMessage(
      `${alertsToInform.length} active alerts:\n${alertsToInform.join('\n')}`
    );
  }
}

export async function clearStaleAlerts() {
  await writeJSONFile('stale_alerts.json', { alertIds: [] });
}
