import ky from 'ky';

export { HTTPError } from 'ky';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type APIData<T = any> = { data: T };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type APIError<T = any> = { error: T };

/**
 * Backend API
 */
export const api = ky.create({
  credentials: 'include',
  prefixUrl: process.env.NEXT_PUBLIC_BACKEND_API_URL,
});
