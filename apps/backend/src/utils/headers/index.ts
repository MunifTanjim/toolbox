import type { Request } from 'express';

export const parseAuthorizationHeader = (
  req: Request
): { scheme: 'bearer' | string; value: string } | null => {
  const authorizationHeader = req.get('Authorization');

  if (!authorizationHeader) {
    return null;
  }

  const matches = authorizationHeader.match(/(\S+)\s+(\S+)/);

  if (!matches) {
    return null;
  }

  const scheme = matches[1].toLowerCase();
  const value = matches[2];

  return { scheme, value };
};
