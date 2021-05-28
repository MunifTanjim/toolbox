import { toSeconds } from 'utils/datetime';

/**
 * get redis expire timeout (seconds)
 */
export const toExpireTimeout = (
  /**
   * `Date` instance or unix milliseconds
   */
  expiresAt: Date | number
): number => {
  const now = Date.now();

  let timeout: number;

  if (expiresAt instanceof Date) {
    timeout = expiresAt.getTime() - now;
  } else {
    timeout = expiresAt - now;
  }

  if (timeout < 0) {
    timeout = 0;
  }

  return parseInt(toSeconds(timeout).toString());
};
