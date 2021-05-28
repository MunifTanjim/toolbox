import type { Transaction } from 'knex';
import Knex from 'knex';
import { roundRobin } from 'utils/round-robin';
import { clientConfigs, masterConfig, replicaConfigs } from './config';
import { getConnectionUri } from './connection-uri';

const masterConnection = Knex({
  connection: getConnectionUri(masterConfig),
  ...clientConfigs,
});

const readOnlyConnections = replicaConfigs.map((replicaConfig) => {
  return Knex({
    connection: getConnectionUri(replicaConfig),
    ...clientConfigs,
  });
});

const getReadOnlyConnection = readOnlyConnections.length
  ? roundRobin(readOnlyConnections)
  : () => masterConnection;

/**
 * Picks a knex connection from read/write pools
 */
export function pickKnex(type: 'read' | 'write' = 'write'): Knex {
  if (type === 'write') {
    return masterConnection;
  }

  return getReadOnlyConnection();
}

/**
 * Perform database operation inside transaction
 */
export const useTransaction =
  (trx?: Transaction) =>
  async <T>(operationHandler: (trx: Transaction) => Promise<T>): Promise<T> => {
    if (trx) {
      return operationHandler(trx);
    }

    return masterConnection.transaction(operationHandler);
  };
