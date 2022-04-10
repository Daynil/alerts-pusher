import {
  clearStaleAlerts,
  getCurrentLocalAlerts
} from './local-weather-alerts';
import { runAtIntervalForLengthOfTime, timeToMS } from './util/util';

runAtIntervalForLengthOfTime(
  timeToMS(2, 'second'),
  timeToMS(8, 'second'),
  getCurrentLocalAlerts,
  'tornado'
).then(() => clearStaleAlerts());
