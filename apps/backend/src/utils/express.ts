import config from 'config';
import type { Server } from 'http';

const expressConfig = config.get('express');

const closeServer = async (server: Server): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!server.listening) {
      return resolve();
    }

    server.close((err) => {
      if (err) {
        console.error(`[Graceful Shutdown] Server: failed to close!`);
        return reject(err);
      }

      console.warn('[Graceful Shutdown] Server: closed!');
      return resolve();
    });
  });
};

export const shutdownGracefully = (
  server: Server,
  signal: NodeJS.Signals
): void => {
  console.warn(
    `[Graceful Shutdown] received signal(${signal}), attempting to shutdown gracefully...`
  );

  // we need to stop accepting new requests first.
  // if we close the database connections first instead
  // while still accepting new requests, that's gonna cause trouble.

  closeServer(server)
    .then(() => {
      console.warn('[Graceful Shutdown] successful!');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
    });

  setTimeout(() => {
    console.error('[Graceful Shutdown] failed!');
    process.exit(1);
  }, expressConfig.killTimeout);
};
