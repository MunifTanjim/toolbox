import type { Format } from 'convict';
import convict from 'convict';
import ms from 'ms';
import type { LogLevel } from '../libs/logger';
import { validLogLevels } from '../libs/logger';

const timeFormat: Format = {
  name: 'time',
  validate: (value) => {
    ms(value);
  },
  coerce: (value) => {
    if (/^\d+$/.test(value)) {
      return parseInt(value, 10);
    }

    return ms(value);
  },
};

convict.addFormat(timeFormat);

const environments = ['production', 'development', 'test'] as const;

export type Environment = typeof environments[number];

export const config = convict({
  env: {
    doc: 'Environment',
    format: environments,
    default: 'development' as Environment,
    env: 'NODE_ENV',
  },
  port: {
    doc: 'Application Port',
    format: 'port',
    default: 9000,
    env: 'PORT',
  },
  logLevel: {
    doc: 'Log Level',
    format: validLogLevels,
    default: 'info' as LogLevel,
    env: 'LOG_LEVEL',
  },
  domain: {
    backend: {
      doc: 'Backend Domain',
      format: String,
      default: 'api.toolbox.local',
      env: 'DOMAIN_BACKEND',
    },
    frontend: {
      doc: 'Frontend Domain',
      format: String,
      default: 'toolbox.local',
      env: 'DOMAIN_FRONTEND',
    },
  },
  express: {
    killTimeout: {
      doc: 'Kill Timeout',
      format: 'time',
      default: '5s' as unknown as number,
      env: 'EXPRESS_KILL_TIMEOUT',
    },
  },
  cookie: {
    secret: {
      doc: 'Cookie Secret',
      format: String,
      default: '',
      env: 'COOKIE_SECRET',
      sensitive: true,
    },
    name: {
      session: {
        doc: 'Cookie Name (Session)',
        format: String,
        default: '__ts__',
        env: 'COOKIE_NAME_SESSION',
      },
    },
  },
  database: {
    name: {
      doc: 'Database name',
      format: String,
      default: 'toolbox',
      env: 'DATABASE_NAME',
    },
    username: {
      doc: 'Database User',
      format: String,
      default: 'postgres',
      env: 'DATABASE_USERNAME',
      sensitive: true,
    },
    password: {
      doc: 'Database Password',
      format: String,
      default: 'postgres',
      env: 'DATABASE_PASSWORD',
      sensitive: true,
    },
    host: {
      doc: 'Database Host',
      format: String,
      default: '127.0.0.1',
      env: 'DATABASE_HOST',
    },
    port: {
      doc: 'Database Port',
      format: 'port',
      default: 5432,
      env: 'DATABASE_PORT',
    },
    replica: {
      name: {
        doc: 'Database name for replicas (comma seperated)',
        format: String,
        default: 'toolbox',
        env: 'DATABASE_REPLICA_NAME',
      },
      username: {
        doc: 'Database User for replicas (comma seperated)',
        format: String,
        default: 'postgres',
        env: 'DATABASE_REPLICA_USERNAME',
        sensitive: true,
      },
      password: {
        doc: 'Database Password for replicas (comma seperated)',
        format: String,
        default: 'postgres',
        env: 'DATABASE_REPLICA_PASSWORD',
        sensitive: true,
      },
      host: {
        doc: 'Database Host for replicas (comma seperated)',
        format: String,
        default: '',
        env: 'DATABASE_REPLICA_HOST',
      },
      port: {
        doc: 'Database Port for replicas (comma seperated)',
        format: String,
        default: '3306',
        env: 'DATABASE_REPLICA_PORT',
      },
    },
  },
  redis: {
    host: {
      doc: 'Redis Connection URI',
      format: String,
      default: '127.0.0.1',
      env: 'REDIS_HOST',
    },
    port: {
      doc: 'Redis Connection URI',
      format: 'port',
      default: 6379,
      env: 'REDIS_PORT',
    },
  },
});

config.validate({ allowed: 'strict' });

export default config;
