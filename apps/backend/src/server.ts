import app from 'app';
import config from 'config';
import http from 'http';
import { log } from 'libs/logger';
import { shutdownGracefully } from 'utils/express';

log.debug(`CONFIG: ${config.toString()}`);

app.set('port', config.get('port'));

const server = http.createServer(app);

// https://nodejs.org/api/process.html#process_signal_events
const terminatingSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
terminatingSignals.forEach((signal) => {
  process.on(signal, () => {
    shutdownGracefully(server, signal);
  });
});

server.listen(app.get('port'));

server.on('listening', () => {
  log.info(`Server started! Listening to port: ${app.get('port')}!`);
});

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  switch (error.code) {
    case 'EACCES':
      log.error(
        `Port ${app.get('port')} requires elevated privileges! Exiting...`
      );
      return process.kill(process.pid, 'SIGTERM');
    case 'EADDRINUSE':
      log.error(`Port ${app.get('port')} is already in use! Exiting...`);
      return process.kill(process.pid, 'SIGTERM');
    default:
      throw error;
  }
});
