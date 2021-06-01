import config from 'config';
import type { Handler } from 'express';
import ResponseError from 'libs/response-error';
import LastfmAccount from 'models/LastfmAccount';
import { lastfm, LastfmAPIError } from 'modules/lastfm/api';
import { LastfmApp } from 'modules/lastfm/auth';
import { getSessionKey, deleteSessionKey } from 'modules/lastfm/auth/token';

const domain = config.get('domain');

const callbackUrl = `https://${domain.backend}/lastfm/auth/callback`;

export function getLastfmAuthorizeHandler(): Handler {
  return async (req, res) => {
    const { user } = req.session!;

    const lastfmAccount = await LastfmAccount.query('read').findOne({
      userId: user.id,
    });

    if (lastfmAccount) {
      try {
        const sk = await getSessionKey(lastfmAccount.id);

        if (sk) {
          await lastfm.user.getInfo({ sk });

          return res.status(204).json({
            data: null,
          });
        }
      } catch (err) {
        if (!(err instanceof LastfmAPIError)) {
          throw err;
        }

        if (err.code === 9) {
          await deleteSessionKey(lastfmAccount.id);
        } else {
          throw new ResponseError(err.status, err.message);
        }
      }
    }

    const { url } = LastfmApp.getWebBasedAuthorizationUrl({
      cb: callbackUrl,
    });

    res.redirect(url);
  };
}
