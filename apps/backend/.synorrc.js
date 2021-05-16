require('./build/src/config/env');

const path = require('path');
const config = require('./build/src/config').config;
const { ConnectionString } = require('connection-string');

const { host, port, username, password, name } = config.get('database');

const databaseUri = new ConnectionString('postgresql://', {
  hosts: [{ name: host, port }],
  user: username,
  password,
  path: [name],
  params: {
    synor_migration_record_table: 'synor_migration_record',
  },
}).toString();

const sourceUri = new ConnectionString(`file://`, {
  path: path.resolve('migrations').split('/'),
  params: {
    ignore_invalid_filename: true,
  },
}).toString();

const synorCLIConfig = {
  databaseEngine: '@synor/database-postgresql',
  databaseUri,
  sourceEngine: '@synor/source-file',
  sourceUri,
  migrationInfoNotation: {
    do: 'do',
    undo: 'undo',
    separator: '.',
    extension: 'sql',
  },
};

module.exports = synorCLIConfig;
