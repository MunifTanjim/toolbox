import config from 'config';
import { URL } from 'url';
import { object, string, union } from 'libs/validator';

const lastfmApp = config.get('module.lastfm.app');

const baseUrl = 'https://www.last.fm';

const authCallbackRequestQueryStruct = union([
  object({
    token: string(),
  }),
]);

export const LastfmApp = {
  struct: {
    authCallbackRequestQuery: authCallbackRequestQueryStruct,
  },

  getWebBasedAuthorizationUrl: ({ cb }: { cb?: string } = {}): {
    url: string;
  } => {
    const url = new URL('/api/auth', baseUrl);

    url.searchParams.set('api_key', lastfmApp.apiKey);

    if (cb) {
      url.searchParams.set('cb', cb);
    }

    return {
      url: url.toString(),
    };
  },
};
