#!/usr/bin/env bash

set -euo pipefail

declare flags=""

while [ $# -ge 1 ]; do
  case "$1" in
    -z|--outOfOrder)
      flags="${flags} ${1}"
      shift 1
      ;;
  esac
done

export PATH="./node_modules/.bin:${PATH}"

current_version=$(npx synor current --no-header --columns=version | tail -1)
target_version=$(npx synor info --no-header --columns=version --filter=state=pending | tail -1)

if test "$target_version" = ''; then
  target_version="$current_version"
fi

NODE_ENV="${NODE_ENV:-""}"

if test "$NODE_ENV" = '' || test "$NODE_ENV" = 'development' || test "$NODE_ENV" = 'test'; then
  echo $ npx synor migrate --from=${current_version} --to=${target_version} ${flags}
  echo
  npx synor migrate --from=${current_version} --to=${target_version} ${flags}
else
  echo $ npx synor migrate ${target_version} ${flags}
  echo
  npx synor migrate ${target_version} ${flags}
fi
