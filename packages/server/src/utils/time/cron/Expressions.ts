export const EVERY_MINUTE = "* * * * *";

export const EVERY_HOUR = "0 * * * *";

export function everyMinutes(minutes: number) {
  return `*/${minutes} * * * *`;
}
