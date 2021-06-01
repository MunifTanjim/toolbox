import { api } from './api';
import type { Endpoint } from './types';

export { LastfmAPIError } from './error';

const auth = {
  getSession: async (
    params: Endpoint['auth.getSession']['request']
  ): Promise<Endpoint['auth.getSession']['response']> => {
    const data = await api('auth.getSession', params, { sign: true });
    return data;
  },
};

const user = {
  getInfo: async (
    params: Endpoint['user.getInfo']['request']
  ): Promise<Endpoint['user.getInfo']['response']> => {
    const data = await api('user.getInfo', params);
    return data;
  },
};

export const lastfm = {
  auth,
  user,
};
