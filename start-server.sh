#!/usr/bin/env bash
set -e

_shutdown_() {
  # https://nav-it.slack.com/archives/C5KUST8N6/p1543497847341300
  echo "shutdown initialized, allowing incoming requests for 5 seconds before continuing"
  sleep 5
  nginx -s quit
  wait "$pid"
}

export APP_HOSTNAME="${HOSTNAME:-localhost}"
export APP_PORT="${APP_PORT:-443}"
export APP_NAME="${APP_NAME:-devimg}"

envsubst '$APP_PORT $APP_HOSTNAME $APP_NAME $AUTH_PROXY_BASE_URL_WSS $AUTH_PROXY_BASE_URL $AUTH_PROXY_BASE_URL_WSS' < /etc/nginx/conf.d/app.conf.template > /etc/nginx/conf.d/default.conf


echo "### Nginx conf ###"
cat /etc/nginx/conf.d/default.conf

nginx -g "daemon off;" &
pid=$!
wait "$pid"
