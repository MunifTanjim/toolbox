import config from 'config';
import type { Handler } from 'express';
import { useTransaction } from 'libs/database';
import ResponseError from 'libs/response-error';
import { assertRequest } from 'libs/validator/request';
import LastfmAccount from 'models/LastfmAccount';
import { lastfm, LastfmAPIError } from 'modules/lastfm/api';
import { LastfmApp } from 'modules/lastfm/auth';
import { storeSessionKey } from 'modules/lastfm/auth/token';

const domain = config.get('domain');

export function getLastfmAuthCallbackHandler(): Handler {
  return async (req, res) => {
    assertRequest(req, 'query', LastfmApp.struct.authCallbackRequestQuery);

    const { token } = req.query;

    const { user } = req.session!;

    try {
      const { session } = await lastfm.auth.getSession({ token });

      const { user: userInfo } = await lastfm.user.getInfo({
        sk: session.key,
      });

      const registeredAt = new Date(
        Number(userInfo.registered.unixtime) * 1000
      );

      await useTransaction()(async (trx) => {
        let lastfmAccount = await LastfmAccount.query(trx).findOne({
          userId: user.id,
        });

        if (lastfmAccount) {
          if (lastfmAccount.registeredAt.getTime() !== registeredAt.getTime()) {
            throw new ResponseError(
              422,
              `user was previously connected with a different Last.fm account`
            );
          }

          await lastfmAccount
            .$query(trx)
            .patch({
              id: userInfo.name,
              name: userInfo.realname,
              username: userInfo.name,
            })
            .returning('*');
        } else {
          lastfmAccount = await LastfmAccount.query(trx)
            .insert({
              id: userInfo.name,
              userId: user.id,
              name: userInfo.realname,
              username: userInfo.name,
              registeredAt,
            })
            .returning('*');
        }

        await storeSessionKey(lastfmAccount.id, session.key);
      });

      res.redirect(`https://${domain.frontend}`);
    } catch (err) {
      if (err instanceof LastfmAPIError) {
        throw new ResponseError(err.status, err.message);
      }

      throw err;
    }
  };
}
