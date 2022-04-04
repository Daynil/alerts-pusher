import { client } from '../util/api';
import { appConfig } from '../util/config';

const alertsRoleTagCode = '<@&858752339761168384>';

/**
 * Make sure to set allow discord messages to override do not disturb on phone if needed.
 */
export async function sendDiscordMessage(message: string) {
  client(appConfig.discord.hookUrl, 'POST', {
    queryParams: { wait: true },
    body: {
      content: `${alertsRoleTagCode}, ${message}`
    }
  });
}
