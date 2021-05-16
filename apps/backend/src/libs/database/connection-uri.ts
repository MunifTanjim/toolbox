import { ConnectionString } from 'connection-string';

export const getConnectionUri = (config: {
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
}): string => {
  const connectionString = new ConnectionString('postgresql://', {
    hosts: [{ name: config.host, port: config.port }],
    user: config.username,
    password: config.password,
    path: [config.name],
  });

  return connectionString.toString();
};
