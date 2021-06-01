import { redis } from 'libs/redis';

export async function storeSessionKey(
  accountId: string,
  sessionKey: string
): Promise<void> {
  const key = `lastfm:${accountId}:session_key`;
  await redis.set(key, sessionKey);
}

export async function getSessionKey(accountId: string): Promise<string | null> {
  const key = `lastfm:${accountId}:session_key`;
  const sk = await redis.get(key);
  return sk;
}

export async function deleteSessionKey(accountId: string): Promise<void> {
  const key = `lastfm:${accountId}:session_key`;
  await redis.del(key);
}
