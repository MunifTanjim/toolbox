import pino from 'pino';
import type { LevelWithSilent as LogLevel, LoggerOptions } from 'pino';

export type { LevelWithSilent as LogLevel } from 'pino';

const { NODE_ENV = 'development', LOG_LEVEL = 'info' } = process.env as {
  NODE_ENV?: string;
  LOG_LEVEL?: LogLevel;
};

const loggerOptionsByEnvironment: Record<string, LoggerOptions> = {
  development: {
    level: LOG_LEVEL,
  },
  production: {
    level: LOG_LEVEL,
  },
};

export const loggerOptions = loggerOptionsByEnvironment[NODE_ENV] ?? {
  level: LOG_LEVEL,
};

export const log = pino(loggerOptions);

export const validLogLevels: ReadonlyArray<LogLevel> = [
  'trace',
  'debug',
  'info',
  'warn',
  'error',
  'fatal',
  'silent',
];

export const isLogLevelSevereEnough = (
  logLevel: LogLevel,
  thresholdLogLevel: LogLevel
): boolean => {
  return (
    validLogLevels.indexOf(logLevel) >=
    validLogLevels.indexOf(thresholdLogLevel)
  );
};

if (!validLogLevels.includes(LOG_LEVEL)) {
  throw new Error(
    `Invalid value for Environment Variable LOG_LEVEL: (${LOG_LEVEL})!`
  );
}

export default log;
