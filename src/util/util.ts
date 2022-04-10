import chalk from 'chalk';

export type valueof<T> = T[keyof T];

export function sleep(sleepLengthInMS: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, sleepLengthInMS);
  });
}

/**
 * Run fn with args _fnArgs every intervalInMS for totalLengthInMS
 */
export async function runAtIntervalForLengthOfTime<
  T extends (...args: unknown[]) => unknown
>(
  intervalInMS: number,
  totalLengthInMS: number,
  fn: T,
  ..._fnArgs: Parameters<T>
) {
  return new Promise<void>((resolve) => {
    console.log(chalk.cyan('Checked at: ', new Date()));
    fn();
    const intervalId = setInterval(() => {
      console.log(chalk.cyan('Checked at: ', new Date()));
      fn();
    }, intervalInMS);
    setTimeout(() => {
      clearInterval(intervalId);
      resolve();
    }, totalLengthInMS);
  });
}

/**
 * When a function is called multiple times, space the calls out an even amount,
 * but making all the requested calls eventually.
 *
 * @returns Same as the return type of the original function
 */
export function spacedCalls<T extends (...args: unknown[]) => unknown>(
  fn: T,
  timeToSpaceCallsInMS: number
) {
  let lastCallTimeInMS = -1;

  const spacedFunction = function (...args: Parameters<T>): ReturnType<T> {
    if (lastCallTimeInMS < 0) {
      lastCallTimeInMS = Date.now();
      return fn.apply(this, args);
    } else {
      setTimeout(() => {
        if (Date.now() - lastCallTimeInMS >= timeToSpaceCallsInMS) {
          lastCallTimeInMS = Date.now();
          return fn.apply(this, args);
        } else {
          return spacedFunction.call(this, ...args);
        }
      }, Math.max(timeToSpaceCallsInMS - (Date.now() - lastCallTimeInMS), 0));
    }
  };

  return spacedFunction;
}

export enum MillisecondsPerUnitTime {
  second = 1000,
  minute = second * 60,
  hour = minute * 60,
  day = hour * 24
}

export function timeToMS(
  amount: number,
  unit: keyof typeof MillisecondsPerUnitTime
) {
  return MillisecondsPerUnitTime[unit] * amount;
}
