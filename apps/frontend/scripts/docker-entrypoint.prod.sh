#!/usr/bin/env bash

set -eo pipefail

./node_modules/.bin/next build

exec ./node_modules/.bin/next start
