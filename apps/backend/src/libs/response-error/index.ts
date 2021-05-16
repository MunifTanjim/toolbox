export type ErrorLocationType =
  | 'body'
  | 'cookies'
  | 'headers'
  | 'params'
  | 'query'
  | 'signedCookies'
  | 'url';

export type EndpointError = {
  /**
   * Represents the code for this error.
   * This property value will usually represent the HTTP response code.
   * If there are multiple errors, code will be the error code for the first error.
   */
  code: number;
  /**
   * A human readable message providing more details about the error.
   * If there are multiple errors, message will be the message for the first error.
   */
  message: string;
  /**
   * Container for any additional information regarding the error.
   * If the service returns multiple errors, each element in the errors array represents a different error.
   */
  errors: Array<{
    /**
     * Unique identifier for the service raising this error.
     * This helps distinguish service-specific errors (i.e. error inserting an event in a calendar)
     * from general protocol errors (i.e. file not found).
     * e.g.: `Calendar`
     */
    domain?: string;
    /**
     * Unique identifier for this error.
     * Different from the `error.code` property in that this is not an http response code.
     * e.g.: `ResourceNotFoundException`
     */
    reason?: string;
    /**
     * A human readable message providing more details about the error.
     * If there is only one error, this field will match `error.message`.
     */
    message: string;
    /**
     * The location of the error (the interpretation of its value depends on `locationType`).
     */
    location?: string;
    /**
     * Indicates how the `location` property should be interpreted.
     */
    locationType?: ErrorLocationType;
    /**
     * A URI for a help text that might shed some more light on the error.
     */
    extendedHelp?: string;
    /**
     * A URI for a report form used by the service to collect data about the error condition.
     * This URI should be preloaded with parameters describing the request.
     */
    sendReport?: string;
  }>;
};

class ResponseError extends Error {
  name: string;

  statusCode: EndpointError['code'];

  errors: EndpointError['errors'];

  constructor(
    statusCode: number,
    message: string,
    errors?: EndpointError['errors']
  ) {
    super(message);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errors = errors ?? [{ message }];
  }

  toJSON(): EndpointError {
    return {
      code: this.statusCode,
      message: this.message,
      errors: this.errors,
    };
  }
}

export default ResponseError;
