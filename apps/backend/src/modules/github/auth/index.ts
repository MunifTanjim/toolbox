import { Octokit } from '@octokit/core';
import type {
  ExchangeWebFlowCodeGitHubAppOptions,
  ExchangeWebFlowCodeGitHubAppResponse,
  GetWebFlowAuthorizationUrlGitHubAppOptions,
  GetWebFlowAuthorizationUrlGitHubAppResult,
  RefreshTokenOptions,
  RefreshTokenResponse,
} from '@octokit/oauth-methods';
import {
  exchangeWebFlowCode,
  getWebFlowAuthorizationUrl,
  refreshToken,
} from '@octokit/oauth-methods';
import type { Endpoints, OctokitResponse } from '@octokit/types';
import config from 'config';
import { enums, object, string, union } from 'libs/validator';

const githubApp = config.get('module.github.app');

const oAuthCallbackRequestQueryStruct = union([
  object({
    code: string(),
    state: string(),
  }),
  object({
    error: enums([
      'access_denied',
      'application_suspended',
      'redirect_uri_mismatch',
    ]),
    error_description: string(),
    error_uri: string(),
    state: string(),
  }),
]);

export type GitHubAppCreateTokenErrorResponse = OctokitResponse<{
  error:
    | 'incorrect_client_credentials'
    | 'redirect_uri_mismatch'
    | 'bad_verification_code';
  error_description: string;
  error_uri: string;
}>;

export const GitHubApp = {
  struct: {
    oAuthCallbackRequestQuery: oAuthCallbackRequestQueryStruct,
  },

  /**
   * @throws `RequestError & { response: GitHubAppCreateTokenErrorResponse }`
   */
  exchangeWebFlowCode: async (
    options: Omit<
      ExchangeWebFlowCodeGitHubAppOptions,
      'clientType' | 'clientId' | 'clientSecret'
    >
  ): Promise<ExchangeWebFlowCodeGitHubAppResponse['data']> => {
    const { data } = await exchangeWebFlowCode({
      ...options,
      clientType: 'github-app',
      clientId: githubApp.oauth.clientId,
      clientSecret: githubApp.oauth.clientSecret,
    });

    return data;
  },

  getWebFlowAuthorizationUrl: (
    options: Omit<
      GetWebFlowAuthorizationUrlGitHubAppOptions,
      'clientType' | 'clientId'
    > = {}
  ): GetWebFlowAuthorizationUrlGitHubAppResult => {
    const result = getWebFlowAuthorizationUrl({
      ...options,
      clientType: 'github-app',
      clientId: githubApp.oauth.clientId,
    });

    return result;
  },

  refreshToken: async (
    options: Omit<
      RefreshTokenOptions,
      'clientType' | 'clientId' | 'clientSecret'
    >
  ): Promise<RefreshTokenResponse['data']> => {
    const { data } = await refreshToken({
      ...options,
      clientType: 'github-app',
      clientId: githubApp.oauth.clientId,
      clientSecret: githubApp.oauth.clientSecret,
    });

    return data;
  },
};

export const GithubUser = {
  get: async ({
    access_token,
  }: {
    access_token: string;
  }): Promise<Endpoints['GET /user']['response']['data']> => {
    const octokit = new Octokit({ auth: access_token });
    const { data } = await octokit.request('GET /user');
    return data;
  },
  getEmails: async ({
    access_token,
  }: {
    access_token: string;
  }): Promise<Endpoints['GET /user/emails']['response']['data']> => {
    const octokit = new Octokit({ auth: access_token });
    const { data } = await octokit.request('GET /user/emails');
    return data;
  },
};
