import config from 'config';
import { createHash } from 'crypto';
import type { CookieOptions, Request, Response } from 'express';
import { redis, toExpireTimeout } from 'libs/redis';
import { getExpiresAt, toMilliseconds } from 'utils/datetime';
import { parseAuthorizationHeader } from 'utils/headers';
import { getKsuid } from 'utils/ksuid';
import type { SessionData } from './types';

const env = config.get('env');
const cookieDomain = config.get('domain.frontend');
const cookieName = config.get('cookie.name.session');

/**
 * session expires after inactivity for this duration.
 * should be less than cookie `maxAge`.
 */
const SESSION_INACTIVITY_THRESHOLD = '7d';

/**
 * maximum duration for session cookie validity
 */
const SESSION_COOKIE_MAXAGE = '30d';

/**
 * opaque token used for authentication
 */
export const generateAuthToken = (userId: string): string => {
  const ksuid = getKsuid().string;

  const token = createHash('sha512')
    .update(Buffer.from(`${userId}:${ksuid}`))
    .digest('hex');

  return token;
};

export const extractAuthorizationToken = (
  req: Request
): { type: 'bearer'; value: string } | null => {
  const authorizationHeader = parseAuthorizationHeader(req);

  if (authorizationHeader?.scheme === 'bearer') {
    return {
      type: authorizationHeader.scheme,
      value: authorizationHeader.value,
    };
  }

  const token: string = req.signedCookies[cookieName];

  if (token) {
    return {
      type: 'bearer',
      value: token,
    };
  }

  return null;
};

const getCookieOptions = (): CookieOptions => {
  const secure = env === 'production';

  return {
    domain: cookieDomain,
    httpOnly: true,
    secure: secure,
    signed: true,
    maxAge: toMilliseconds(SESSION_COOKIE_MAXAGE),
  };
};

export const setSessionCookie = (res: Response, token: string): void => {
  const cookieOptions = getCookieOptions();
  res.cookie(cookieName, token, cookieOptions);
};

export const clearSessionCookie = (res: Response): void => {
  const { expires, maxAge, ...cookieOptions } = getCookieOptions();
  res.clearCookie(cookieName, cookieOptions);
};

/**
 * cache key for redis
 */
export const getCacheKey = (token: string): string => {
  return `session:${token}`;
};

/**
 * save session data to redis
 */
export const saveSessionData = async (
  token: string,
  data: SessionData
): Promise<void> => {
  const cacheKey = getCacheKey(token);
  const expiresAt = getExpiresAt(SESSION_INACTIVITY_THRESHOLD);
  const stringifiedData = JSON.stringify(data);

  await redis.setex(cacheKey, toExpireTimeout(expiresAt), stringifiedData);
};

/**
 * delete session data from redis
 */
export const deleteSessionData = async (token: string): Promise<void> => {
  const cacheKey = getCacheKey(token);

  await redis.del(cacheKey);
};

/**
 * get session data from redis
 */
export const getSessionData = async (
  token: string
): Promise<SessionData | null> => {
  const cacheKey = getCacheKey(token);

  const stringifiedData = await redis.get(cacheKey);
  if (!stringifiedData) {
    return null;
  }

  const data = JSON.parse(stringifiedData);
  if (!data.user) {
    return null;
  }

  return data;
};

export const extendSessionValidity = async (token: string): Promise<number> => {
  const cacheKey = getCacheKey(token);
  const expiresAt = getExpiresAt(SESSION_INACTIVITY_THRESHOLD);
  return redis.expire(cacheKey, toExpireTimeout(expiresAt));
};
