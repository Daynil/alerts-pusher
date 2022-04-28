import {
  clearStaleAlerts,
  getCurrentLocalAlerts
} from './local-weather-alerts';
import { runAtIntervalForLengthOfTime, timeToMS } from './util/util';

runAtIntervalForLengthOfTime(
  timeToMS(1, 'hour'),
  timeToMS(10, 'day'),
  getCurrentLocalAlerts,
  'tornado'
).then(() => clearStaleAlerts());
