#!/bin/bash

set -exo pipefail

declare -r CERTBOT=/usr/local/bin/certbot
declare -r WEBROOT_DIR=/certbot-webroot

get-or-renew() {
  echo "Attempting to get or renew certificates..."

  local DOMAINS="${DOMAINS:-""} "
  local EMAIL=${EMAIL:-""}
  local FLAGS=" "

  while [[ $# -gt 0 ]]; do
    case $1 in
      -d | --domains)
        DOMAINS+="$2 "
        shift 2;;
      -m | --email)
        EMAIL="$2"
        shift 2;;
      -* | --*)
        FLAGS+="$1 "
        shift;;
      *)
        shift;;
    esac
  done

  if [[ -z "$EMAIL" ]]; then
    echo "Specifying an email is required!"
    exit 1
  fi

  if [[ -z "${DOMAINS// }" ]]; then
    echo "At least one domain is required!"
    exit 1
  fi

  local -r domains=($DOMAINS)
  local -r domains_args=$(printf -- '-d %s ' "${domains[@]}")

  $CERTBOT certonly --non-interactive --agree-tos --eff-email --keep-until-expiring \
      --preferred-challenges=http --webroot --webroot-path=$WEBROOT_DIR \
      --email=$EMAIL $FLAGS $domains_args
}

declare cmd=""

case $1 in
  get-or-renew) cmd=$1; shift;;
esac

case $cmd in
  get-or-renew)
    get-or-renew $@
    ;;
  *)
    $CERTBOT $@
    ;;
esac

echo
echo "Done!"
