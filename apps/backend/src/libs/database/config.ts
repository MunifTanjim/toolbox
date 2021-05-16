import config from 'config';
import type { Config } from 'knex';
import log from 'libs/logger';
import { knexSnakeCaseMappers } from 'objection';

type DatabaseConfig = Parameters<
  typeof import('./connection-uri').getConnectionUri
>[0];

const databaseConfig = config.get('database');

export const masterConfig: DatabaseConfig = {
  host: databaseConfig.host,
  port: databaseConfig.port,
  username: databaseConfig.username,
  password: databaseConfig.password,
  name: databaseConfig.name,
};

const replicaHosts = databaseConfig.replica.host.split(',').filter(Boolean);
const replicaPorts = databaseConfig.replica.port.split(',').map(Number);
const replicaUsernames = databaseConfig.replica.username.split(',');
const replicaPasswords = databaseConfig.replica.password.split(',');
const replicaDatabaseNames = databaseConfig.replica.name.split(',');

export const replicaConfigs = replicaHosts.map<DatabaseConfig>(
  (host, index) => ({
    host,
    port: replicaPorts[index] || masterConfig.port,
    username: replicaUsernames[index] || masterConfig.username,
    password: replicaPasswords[index] || masterConfig.password,
    name: replicaDatabaseNames[index] || masterConfig.name,
  })
);

export const clientConfigs: Config = {
  client: 'pg',
  log: {
    debug: log.debug.bind(log),
    error: log.error.bind(log),
    warn: log.warn.bind(log),
  },
  debug: true,
  ...knexSnakeCaseMappers(),
};
