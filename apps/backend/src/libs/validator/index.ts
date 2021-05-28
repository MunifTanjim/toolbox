import type { Struct } from 'superstruct';
import { define, size, string } from 'superstruct';
import { isEmail } from 'utils/string/email';

export * from 'superstruct';

export const email = (): Struct<string, null> => {
  return define<string>('email', (value) => isEmail(value));
};

export const ksuid_string = (): Struct<string, null> => {
  return size(string(), 27);
};
