import config from 'config';
import cookieParser from 'cookie-parser';
import express from 'express';
import { useCatcherMiddlewares } from 'middlewares/catchers';
import { useCors } from 'middlewares/cors';
import { useRequestLoggerMiddleware } from 'middlewares/request-logger';
import { useAuthRouter } from 'modules/auth/express';
import { useGithubRouter } from 'modules/github/express';
import { useHealthRouter } from 'modules/health/express';

const cookieConifg = config.get('cookie');

const app = express();

useCors(app);

app.use(cookieParser(cookieConifg.secret));

app.use(express.json());

useRequestLoggerMiddleware(app);

useHealthRouter(app);
useAuthRouter(app);
useGithubRouter(app);

useCatcherMiddlewares(app);

export default app;
