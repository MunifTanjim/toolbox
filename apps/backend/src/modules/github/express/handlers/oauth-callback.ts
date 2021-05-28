import { RequestError } from '@octokit/request-error';
import config from 'config';
import type { Handler } from 'express';
import { useTransaction } from 'libs/database';
import ResponseError from 'libs/response-error';
import { assertRequest } from 'libs/validator/request';
import GithubAccount from 'models/GithubAccount';
import User from 'models/User';
import { Session } from 'modules/auth/session';
import { GitHubApp, GithubUser } from 'modules/github/auth';
import { storeAccessToken, storeRefreshToken } from 'modules/github/auth/token';

const domain = config.get('domain');

export function getOAuthCallbackHandler(): Handler {
  return async (req, res) => {
    assertRequest(req, 'query', GitHubApp.struct.oAuthCallbackRequestQuery);

    const query = req.query;

    if ('error' in query) {
      throw new ResponseError(403, query.error_description);
    }

    try {
      const tokenData = await GitHubApp.exchangeWebFlowCode({
        code: query.code,
      });

      const { access_token } = tokenData;

      const [githubUserData, emailItems] = await Promise.all([
        GithubUser.get({ access_token }),
        GithubUser.getEmails({ access_token }),
      ]);

      const primaryEmailItem = emailItems.find((item) => item.primary);

      if (!primaryEmailItem?.verified) {
        throw new ResponseError(
          403,
          `GitHub account does not have verified primary email!`
        );
      }

      const email = primaryEmailItem.email;

      const user = await useTransaction()(async (trx) => {
        const user = await User.query(trx)
          .findOne({ email })
          .withGraphFetched('githubAccount');

        if (!user) {
          throw new ResponseError(403, `No user found!`);
        }

        if (!user.githubAccount) {
          user.githubAccount = await GithubAccount.query(trx)
            .insert({
              id: githubUserData.id,
              userId: user.id,
              name: githubUserData.name ?? `Unknown`,
              email,
            })
            .returning('*');
        }

        const githubAccountId = user.githubAccount!.id;

        if ('refresh_token' in tokenData) {
          const {
            access_token,
            expires_in,
            refresh_token,
            refresh_token_expires_in,
          } = tokenData;

          await Promise.all([
            storeAccessToken(githubAccountId, access_token, expires_in),
            storeRefreshToken(
              githubAccountId,
              refresh_token,
              refresh_token_expires_in
            ),
          ]);
        } else {
          await storeAccessToken(githubAccountId, access_token);
        }

        return user;
      });

      await Session.create(user, res);

      res.redirect(`https://${domain.frontend}`);
    } catch (err) {
      if (err instanceof RequestError) {
        // @ts-ignore ces't la vie
        const response: ExchangeCodeErrorResponse = err.response;
        throw new ResponseError(err.status, response.data.error_description);
      }

      throw err;
    }
  };
}
