import config from 'config';
import cookieParser from 'cookie-parser';
import express from 'express';
import { useCatcherMiddlewares } from 'middlewares/catchers';
import { useRequestLoggerMiddleware } from 'middlewares/request-logger';
import { useHealthRouter } from 'modules/health/express';

const cookieConifg = config.get('cookie');

const app = express();

app.use(express.json());

app.use(cookieParser(cookieConifg.secret));

useRequestLoggerMiddleware(app);

useHealthRouter(app);

useCatcherMiddlewares(app);

export default app;
