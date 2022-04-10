import { getCurrentLocalAlerts } from './local-weather-alerts';
import { runAtIntervalForLengthOfTime, timeToMS } from './util/util';

runAtIntervalForLengthOfTime(
  timeToMS(1, 'second'),
  timeToMS(3, 'minute'),
  getCurrentLocalAlerts,
  'tornado'
);
