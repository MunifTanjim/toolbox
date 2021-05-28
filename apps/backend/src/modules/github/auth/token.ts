import { redis } from 'libs/redis';
import { GitHubApp } from '.';

export async function storeRefreshToken(
  accountId: number,
  refreshToken: string,
  expiresIn: number
): Promise<void> {
  const key = `github:${accountId}:refresh_token`;
  await redis.setex(key, expiresIn, refreshToken);
}

export async function storeAccessToken(
  accountId: number,
  accessToken: string,
  expiresIn?: number
): Promise<void> {
  const key = `github:${accountId}:access_token`;

  if (typeof expiresIn === 'undefined') {
    await redis.set(key, accessToken);
    return;
  }

  await redis.setex(key, expiresIn, accessToken);
}

export async function getRefreshToken(
  accountId: number
): Promise<string | null> {
  const key = `github:${accountId}:refresh_token`;
  const token = await redis.get(key);
  return token;
}

export async function getAccessToken(
  accountId: number
): Promise<string | null> {
  const key = `github:${accountId}:access_token`;

  const token = await redis.get(key);

  if (!token) {
    const refreshToken = await getRefreshToken(accountId);

    if (!refreshToken) {
      return token;
    }

    const {
      access_token,
      expires_in,
      refresh_token,
      refresh_token_expires_in,
    } = await GitHubApp.refreshToken({ refreshToken });

    await Promise.all([
      storeAccessToken(accountId, access_token, expires_in),
      storeRefreshToken(accountId, refresh_token, refresh_token_expires_in),
    ]);

    return access_token;
  }

  return token;
}
