#!/usr/bin/env bash

set -eo pipefail

worker=0

# SIGTERM-handler
term_handler() {
  if [ $worker -ne 0 ]; then
    kill -SIGTERM "$worker"
    wait "$worker"
  fi

  exit 143 # 128 + 15 -- SIGTERM
}

trap term_handler SIGTERM

# the redirection trick makes sure that $! is the pid of the main process
node --max-http-header-size=16000 build/src/index.js > >(./node_modules/.bin/pino-pretty --config .pino-prettyrc.js) &
worker="$!"

wait $worker
