import type { ErrorRequestHandler, Request } from 'express';
import type { EndpointError, ErrorLocationType } from 'libs/response-error';
import ResponseError from 'libs/response-error';
import type { Infer, Struct, StructError } from 'libs/validator';

type RequestSegment = Exclude<ErrorLocationType, 'url'>;

export class RequestValidationError extends Error {
  segment: RequestSegment;
  structError: StructError;

  constructor(structError: StructError, segment: RequestSegment) {
    super(structError.message);

    this.segment = segment;
    this.structError = structError;
  }
}

export function assertRequest<
  Rs extends unknown,
  Rq extends unknown,
  Qr extends unknown,
  Pr extends unknown,
  Segment extends RequestSegment,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S extends Struct<any, any>
>(
  req: Request<Pr, Rs, Rq, Qr>,
  segment: Segment,
  struct: S
): asserts req is 'body' extends Segment
  ? Request<Pr, Rs, Infer<S>, Qr>
  : 'cookies' extends Segment
  ? Request<Pr, Rs, Rq, Qr> & { cookies: Infer<S> }
  : 'headers' extends Segment
  ? Request<Pr, Rs, Rq, Qr> & { headers: Infer<S> }
  : 'params' extends Segment
  ? Request<Infer<S>, Rs, Rq, Qr>
  : 'query' extends Segment
  ? Request<Pr, Rs, Rq, Infer<S>>
  : 'signedCookies' extends Segment
  ? Request<Pr, Rs, Rq, Qr> & { signedCookies: Infer<S> }
  : Request<Pr, Rs, Rq, Qr> {
  const [error, result] = struct.validate(req[segment], {
    coerce: true,
  });

  if (error) {
    throw new RequestValidationError(error, segment);
  }

  req[segment] = result;
}

export const validationErrorHandler: ErrorRequestHandler = (
  err: unknown,
  _req,
  _res,
  next
) => {
  if (err instanceof RequestValidationError) {
    const errors: EndpointError['errors'] = err.structError
      .failures()
      .map(({ message, path }) => ({
        message,
        location: path.join('.'),
        locationType: err.segment,
      }));

    return next(new ResponseError(400, 'Validation Error', errors));
  }

  return next(err);
};
