import ms from 'ms';

/**
 * get time in milliseconds
 */
export const toMilliseconds = (
  /**
   * milliseconds or time string
   */
  time: number | string
): number => {
  if (typeof time === 'string') {
    return ms(time);
  }

  return time;
};

/**
 * get time in seconds
 */
export const toSeconds = (
  /**
   * milliseconds or time string
   */
  time: number | string
): number => {
  return toMilliseconds(time) / 1000;
};

/**
 * unix time in milliseconds
 */
export const getExpiresAt = (
  /**
   * milliseconds or time string
   */
  lifetime: number | string,
  /**
   * milliseconds since unix epoch
   */
  startTime: number = Date.now()
): number => {
  if (typeof lifetime === 'string') {
    return startTime + toMilliseconds(lifetime);
  }

  return startTime + lifetime;
};
