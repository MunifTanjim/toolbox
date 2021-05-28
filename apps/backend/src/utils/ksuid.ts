import KSUID from 'ksuid';

/**
 * Generate Random KSUID
 */
export const getKsuid = (date?: Date | number): KSUID => {
  return KSUID.randomSync(date as number);
};
