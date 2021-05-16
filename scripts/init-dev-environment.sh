#!/usr/bin/env bash

command_exists() {
  type "${1}" >/dev/null 2>&1
}

setup_hostess() {
  if ! command_exists hostess; then
    echo "Installing: hostess"

    if [[ $OSTYPE = darwin* ]]; then
      if ! command_exists brew; then
        echo "Error: missing required tool: brew!"
        exit 1
      fi

      brew install hostess
    fi

    if [[ $OSTYPE = linux* ]]; then
      if ! command_exists wget; then
        echo "Error: missing required tool: wget!"
        exit 1
      fi

      _hostess_version="0.5.2"
      _hostess_url="https://github.com/cbednarski/hostess/releases/download/v${_hostess_version}/hostess_linux_amd64"

      wget -qN --show-progress ${_hostess_url} -O /tmp/hostess
      chmod u+x /tmp/hostess
      sudo mv /tmp/hostess /usr/local/bin/hostess
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

setup_hostess
set_local_domains
set_environment_variables

echo "Done!"
