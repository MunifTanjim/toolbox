import type { Request, Response } from 'express';
import log from 'libs/logger';
import type User from 'models/User';
import type { SessionData } from './types';
import {
  clearSessionCookie,
  deleteSessionData,
  extendSessionValidity,
  extractAuthorizationToken,
  generateAuthToken,
  getSessionData,
  saveSessionData,
  setSessionCookie,
} from './utils';

export * from './types';

const create = async (
  user: Pick<User, 'id' | 'name' | 'email'>,
  res: Response
): Promise<{ data: SessionData; token: string }> => {
  const data: SessionData = {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };

  const token = generateAuthToken(user.id);

  await saveSessionData(token, data);
  setSessionCookie(res, token);

  return {
    data,
    token,
  };
};

const destroy = async (req: Request, res: Response): Promise<void> => {
  const token = extractAuthorizationToken(req);

  if (!token) {
    return;
  }

  await deleteSessionData(token.value);

  clearSessionCookie(res);
};

const getData = async (req: Request): Promise<SessionData | null> => {
  const token = extractAuthorizationToken(req);

  if (!token) {
    return null;
  }

  const data = await getSessionData(token.value);

  if (data) {
    extendSessionValidity(token.value).catch((err) => {
      log.error(err, `Failed to extend session validity!`);
    });
  }

  return data;
};

export const Session = {
  create,
  destroy,
  getData,
};
