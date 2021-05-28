import type { Application, ErrorRequestHandler, Handler } from 'express';
import log from 'libs/logger';
import ResponseError from 'libs/response-error';
import { validationErrorHandler } from 'libs/validator/request';

const notFoundHandler: Handler = (req): void => {
  throw new ResponseError(404, `API Endpoint Not Found!`, [
    {
      message: `API Endpoint Not Found!`,
      location: req.url,
      locationType: 'url',
    },
  ]);
};

const errorRespondHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  next
): void => {
  const errorObject =
    err instanceof ResponseError
      ? err
      : new ResponseError(500, 'Server Problem!');

  const error = errorObject.toJSON();

  res.status(errorObject.statusCode).json({
    error,
  });

  next(err);
};

const errorLogHandler: ErrorRequestHandler = (err, _req, _res, _next): void => {
  log.error(err);
};

export const useCatcherMiddlewares = (app: Application): void => {
  app.use(notFoundHandler);

  app.use(validationErrorHandler);
  app.use(errorRespondHandler);
  app.use(errorLogHandler);
};
