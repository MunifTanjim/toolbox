#!/usr/bin/env bash

set -euo pipefail

declare -r DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
declare -r ROOT_DIR="$(cd "${DIR}/.." && pwd)"

command_exists() {
  type "${1}" >/dev/null 2>&1
}

ensure_tool() {
  local -r tool="${1}"
  if ! command_exists ${tool}; then
    echo "Error: missing required tool: ${tool}!"
    exit 1
  fi
}

is_mac() {
  [[ $OSTYPE = darwin* ]]
}

is_linux() {
  [[ $OSTYPE = linux* ]]
}

setup_hostess() {
  if ! command_exists hostess; then
    echo "Installing: hostess"

    if is_mac; then
      ensure_tool brew
      brew install hostess
    fi

    if is_linux; then
      ensure_tool wget

      local -r hostess_version="0.5.2"
      local -r hostess_url="https://github.com/cbednarski/hostess/releases/download/v${hostess_version}/hostess_linux_amd64"

      wget -qN --show-progress ${hostess_url} -O /tmp/hostess
      chmod u+x /tmp/hostess
      sudo mv /tmp/hostess /usr/local/bin/hostess
    fi

    echo ""
  fi
}

setup_mkcert() {
  if ! command_exists mkcert; then
    echo "Installing: mkcert"

    if is_mac; then
      ensure_tool brew
      brew install mkcert
    fi

    if is_linux; then
      ensure_tool wget

      local -r mkcert_version="1.4.3"
      local -r mkcert_url="https://github.com/FiloSottile/mkcert/releases/download/v${mkcert_version}/mkcert-v${mkcert_version}-linux-amd64"

      wget -qN --show-progress ${mkcert_url} -O /tmp/mkcert
      chmod u+x /tmp/mkcert
      sudo mv /tmp/mkcert /usr/local/bin/mkcert
    fi

    echo ""
  fi
}

set_local_domains() {
  echo "Setting up local domains:"
  echo ""

  sudo hostess add toolbox.local 127.0.0.1
  echo ""

  sudo hostess add api.toolbox.local 127.0.0.1
  echo ""
}

set_environment_variables() {
  echo "Setting environment variables..."
  echo ""

  cp .env.template .env

  local -r compose_file="docker-compose.dev.yml"
  echo "COMPOSE_FILE: ${compose_file}"
  sed -i -e "s|{COMPOSE_FILE}|${compose_file}|g" .env

  echo ""
}

setup_dev_ssl() {
  export CAROOT=$(mkcert -CAROOT)

  local -r certs_dir="${ROOT_DIR}/docker/nginx/dev.certs"

  mkdir -p "${certs_dir}"

  echo "Generating Root certificate..."
  mkcert -install
  echo ""

  echo "Generating SSL certificate..."
  mkcert \
    -cert-file "${certs_dir}/toolbox.local-cert.pem" \
    -key-file "${certs_dir}/toolbox.local-key.pem" \
    "toolbox.local" "*.toolbox.local"

  ensure_tool certutil
}

setup_hostess
setup_mkcert
set_local_domains
set_environment_variables
setup_dev_ssl

echo "Done!"
