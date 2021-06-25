import NextRouter from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import type { APIData } from 'utils/api';
import { api, HTTPError } from 'utils/api';

type User = {
  id: string;
  name: string;
  email: string;
};

const fetchUser = async () => {
  try {
    const { data } = await api('auth/user').json<APIData<User>>();
    return data;
  } catch (err) {
    if (err instanceof HTTPError) {
      if ([401].includes(err.response.status)) {
        return null;
      }
    }

    throw err;
  }
};

type UseSessionOptions =
  | { onAuthedRedirect?: string; onUnauthedRedirect?: never }
  | { onAuthedRedirect?: never; onUnauthedRedirect?: string };

export function useSession<Options extends UseSessionOptions>(
  options?: Options
): {
  user: Options['onAuthedRedirect'] extends string
    ? null
    : Options['onUnauthedRedirect'] extends string
    ? User
    : User | null;
  error?: Error;
  isAuthed: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  signout: () => Promise<void>;
};
export function useSession({
  onAuthedRedirect,
  onUnauthedRedirect,
}: UseSessionOptions = {}) {
  const {
    data: user,
    error,
    isValidating,
    mutate,
  } = useSWR('auth/user', fetchUser);

  const isAuthed = Boolean(user);
  const isLoading = typeof user === 'undefined';
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (onAuthedRedirect && isAuthed) {
        NextRouter.push(onAuthedRedirect);
      } else if (onUnauthedRedirect && !isAuthed) {
        NextRouter.push(onUnauthedRedirect);
      }
    }
  }, [isAuthed, isLoading, onAuthedRedirect, onUnauthedRedirect]);

  const signout = useCallback(async () => {
    setIsRefreshing(true);
    await mutate(async () => {
      await api('auth/signout', { method: 'post' });
      return null;
    }, false);
    setIsRefreshing(false);
  }, [mutate]);

  return {
    user: user ?? null,
    error,
    isAuthed,
    isLoading,
    isRefreshing: isRefreshing || isValidating,
    signout,
  };
}
