import type { Application } from 'express';
import { Router } from 'express';
import { authorize } from 'middlewares/authorize';
import { getLastfmAuthCallbackHandler } from 'modules/lastfm/express/handlers/auth-callback';
import { getLastfmAuthorizeHandler } from 'modules/lastfm/express/handlers/authorize';

const router = Router();

router.get('/lastfm/auth/authorize', authorize(), getLastfmAuthorizeHandler());

router.get(
  '/lastfm/auth/callback',
  authorize(),
  getLastfmAuthCallbackHandler()
);

export function useLastfmRouter(app: Application): void {
  app.use('/v0', router);
  app.use('/', router);
}
