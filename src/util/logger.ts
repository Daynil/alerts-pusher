import chalk from 'chalk';
import { sendDiscordMessage } from '../services/discord-service';

const isProduction = false;
const appPrefix = 'weather';

export enum ErrorCriticalLevel {
  MODERATE = 1,
  HIGH = 2,
  WAKE_ME_UP = 99
}

// TODO: we need a database table to log these so we can look back anytime
// TODO: refactor into a service which takes in appname
export const logger = {
  debug(message: string, error?: Error) {
    if (!isProduction) {
      console.debug(chalk.gray(`[${appPrefix}] ${message}`));
      if (error) {
        console.debug(chalk.gray(`[${appPrefix}] ${error.message}`));
        console.debug(chalk.gray(`[${appPrefix}] ${error.stack}`));
      }
    }
  },

  info(message: string) {
    if (!isProduction) console.info(chalk.cyan(`[${appPrefix}] ${message}`));
  },

  log(message: string) {
    if (!isProduction) console.log(`[${appPrefix}] ${message}`);
  },

  warn(message: string) {
    if (!isProduction) console.warn(chalk.yellow(`[${appPrefix}] ${message}`));
  },

  error(error: Error, addedMessage?: string) {
    console.error(chalk.red(`[${appPrefix}] ERROR`));
    if (addedMessage) console.error(addedMessage);
    console.error(error);
  },

  critical(
    error: Error,
    level: ErrorCriticalLevel = ErrorCriticalLevel.MODERATE,
    addedMessage?: string
  ) {
    console.error(chalk.red(`[${appPrefix}] ERROR`));
    if (addedMessage) console.error(addedMessage);
    console.error(error);

    try {
      if (addedMessage)
        sendDiscordMessage(`[${appPrefix}] ERROR MESSAGE: ${addedMessage}`);
      sendDiscordMessage(
        `[${appPrefix}] ERROR RAW: ${error.message}\n${error.stack}`
      );
    } catch (error) {
      console.error(chalk.red(`[${appPrefix}] ERROR`));
      console.error(addedMessage);
      console.error(error);
    }
    if (level >= ErrorCriticalLevel.HIGH) {
      // Can eventually make this email me
    }
    if (level >= ErrorCriticalLevel.WAKE_ME_UP) {
      // Can eventually make this call and/or text me
    }
  }
};
