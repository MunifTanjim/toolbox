import config from 'config';
import Redis from 'ioredis';
import log from 'libs/logger';
import ms from 'ms';

export * from './utils';

const redisConfig = config.get('redis');

export const redis = new Redis({
  ...redisConfig,
});

redis.on('connect', () => {
  log.info('Redis: connection established!');
});

redis.on('end', () => {
  log.info('Redis: connection closed!');
});

redis.on('error', (error) => {
  log.error({ error }, 'Redis: unexpected error');

  redis.quit((error) => {
    if (error) {
      log.error({ error }, 'Redis: failed to quit gracefully!');
    }

    process.nextTick(() => {
      log.fatal('Redis: Sending kill signal because of RedisError!');

      process.kill(process.pid, 'SIGINT');
    });
  });
});

redis.on('reconnecting', (timeBeforeReconnection: number) => {
  log.info(`Redis: trying to reconnect in ${ms(timeBeforeReconnection)}!`);
});
