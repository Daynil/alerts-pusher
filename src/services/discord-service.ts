import { client } from '../util/api';
import { appConfig } from '../util/config';

const alertsRoleTagCode = '<@&858752339761168384>';

/**
 * Send a Discord message to IP alerts channel via webhook.
 * Enforce 1 second between messages to avoid hitting rate limits.
 *
 * **Make sure to set allow Discord messages to override do not disturb
 *    on phone if needed**.
 *
 */
export async function sendDiscordMessage(message: string) {
  client(appConfig.discord.hookUrl, 'POST', {
    queryParams: { wait: true },
    body: {
      content: `${alertsRoleTagCode}, ${message}`
    }
  });
}

// export const sendDiscordMessage = spacedCalls(sendDiscordMessageRaw, 1000);
