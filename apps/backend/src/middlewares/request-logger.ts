import type { Application } from 'express';
import { loggerOptions } from 'libs/logger';
import expressPino from 'pino-http';

const requestLoggerMiddlware = expressPino({
  level: loggerOptions.level,
  redact: {
    paths: [
      'req.headers',
      'res.headers',
      'req.remoteAddress',
      'req.remotePort',
    ],
    remove: true,
  },
});

export const useRequestLoggerMiddleware = (app: Application): void => {
  app.use(requestLoggerMiddlware);
};
