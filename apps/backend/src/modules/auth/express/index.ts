import type { Application } from 'express';
import { Router } from 'express';
import ResponseError from 'libs/response-error';
import { authorize } from 'middlewares/authorize';
import User from 'models/User';
import { getGithubSignInHandler } from 'modules/github/express';
import { Session } from '../session';

const router = Router();

router.get('/auth/signin/github', getGithubSignInHandler());

router.post('/auth/signout', authorize(), async (req, res) => {
  await Session.destroy(req, res);

  res.status(204).json({
    data: null,
  });
});

router.get('/auth/user', authorize(), async (req, res) => {
  if (!req.session) {
    throw new ResponseError(401, `not authenticated!`);
  }

  const userId = req.session.user.id;

  const user = await User.query('read').findById(userId);

  res.status(200).json({
    data: user,
  });
});

export function useAuthRouter(app: Application): void {
  app.use('/v0', router);
  app.use('/', router);
}
