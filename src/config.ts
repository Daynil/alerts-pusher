import dotenv from 'dotenv';
dotenv.config();

/**
 * App specific config goes under app name.
 * Shared config goes in base object.
 */
export const appConfig = {
  coordinates: process.env.COORDINATES,
  cellPhoneNumber: process.env.CELL_PHONE_NUMBER,
};
