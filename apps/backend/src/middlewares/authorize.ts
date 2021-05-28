import type { Handler } from 'express';
import ResponseError from 'libs/response-error';
import { Session } from 'modules/auth/session';

export function authorize(): Handler {
  return async (req, _res, next): Promise<void> => {
    const data = await Session.getData(req);

    if (!data) {
      throw new ResponseError(401, 'not authenticated!');
    }

    req.session = data;

    next();
  };
}
