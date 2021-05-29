import config from 'config';
import cors from 'cors';
import type { Application } from 'express';

const domain = config.get('domain');

const allowedOrigins = [`https://${domain.frontend}`];

export const useCors = (app: Application): void => {
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    })
  );
};
