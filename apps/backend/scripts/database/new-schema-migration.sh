#!/usr/bin/env bash

declare -r DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
declare -r ROOT_DIR="$( cd "${DIR}/../.." >/dev/null 2>&1 && pwd )"

declare -r migration_dir="${ROOT_DIR}/migrations"

if [[ ! -d "${migration_dir}" ]]; then
  mkdir -p "${migration_dir}"
fi

declare -r version=$(($(date +'%s * 1000 + %-N / 1000000')))

declare -r types=("do" "undo")

echo "What is the purpose of this schema migration?"
declare title
read -p ": " title

title="$(echo "${title}" | sed -e 's/[^a-zA-Z0-9\-_]/-/g')"
title="$(echo "${title}" | sed -e 's/^-*//g')"
title="$(echo "${title}" | sed -e 's/-*$//g')"

if [[ -z ${title} ]]; then
  echo "ERROR: Title is empty!"
  exit 1
fi

for _type in "${types[@]}"; do
  declare filepath="${migration_dir}/${version}.${_type}.${title}.sql"
  touch ${filepath}
  if [[ "${_type}" = "do" ]]; then
    echo "  DO: ${filepath/${ROOT_DIR}/.}"
  elif [[ "${_type}" = "undo" ]]; then
    echo "UNDO: ${filepath/${ROOT_DIR}/.}"
  fi
done
