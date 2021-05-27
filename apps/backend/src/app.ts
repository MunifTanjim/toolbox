import express from 'express';
import { useCatcherMiddlewares } from 'middlewares/catchers';
import { useRequestLoggerMiddleware } from 'middlewares/request-logger';
import { useHealthRouter } from 'modules/health/express';

const app = express();

app.use(express.json());

useRequestLoggerMiddleware(app);

useHealthRouter(app);

useCatcherMiddlewares(app);

export default app;
