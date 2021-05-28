import config from 'config';
import type { Handler } from 'express';
import { GitHubApp } from 'modules/github/auth';

const domain = config.get('domain');

const redirectUrl = `https://${domain.backend}/github/oauth/callback`;

export function getGithubSignInHandler(): Handler {
  return (_req, res): void => {
    const { url } = GitHubApp.getWebFlowAuthorizationUrl({
      allowSignup: false,
      redirectUrl,
    });

    res.redirect(url);
  };
}
