#!/usr/bin/env bash

# this should be run from `/etc/cron.daily`

set -eo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
ROOT_DIR="$(cd "${DIR}/../.." && pwd)"

COMPOSE_FILE="${ROOT_DIR}/docker-compose.prod.yml"

echo "Building runner image for letsencrypt..."
echo
docker-compose -f ${COMPOSE_FILE} build letsencrypt

echo
echo "Let's Encrypt..."
echo
docker-compose -f ${COMPOSE_FILE} run --rm letsencrypt get-or-renew
