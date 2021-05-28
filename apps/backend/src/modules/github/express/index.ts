import type { Application } from 'express';
import { Router } from 'express';
import { authorize } from 'middlewares/authorize';
import GithubAccount from 'models/GithubAccount';
import { getOAuthCallbackHandler } from './handlers/oauth-callback';

export * from './handlers/signin';

const router = Router();

router.get('/github/oauth/callback', getOAuthCallbackHandler());

router.get('/github/account', authorize(), async (req, res) => {
  const userId = req.session!.user.id;

  const account = await GithubAccount.query('read').findOne('userId', userId);

  res.status(200).json({
    data: account,
  });
});

export function useGithubRouter(app: Application): void {
  app.use('/v0', router);
  app.use('/', router);
}
