import '@octokit/request-error';

declare module '@octokit/request-error' {
  interface RequestError {
    response: unknown;
  }
}
