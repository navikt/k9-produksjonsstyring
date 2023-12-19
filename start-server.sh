#!/usr/bin/env bash
set -e

_shutdown_() {
  # https://nav-it.slack.com/archives/C5KUST8N6/p1543497847341300
  echo "shutdown initialized, allowing incoming requests for 5 seconds before continuing"
  sleep 5
  nginx -s quit
  wait "$pid"
}

[ -d /tmp/k9-los/] && echo "Feature toggle-directory finnes fra før, tilbakestiller" && rm -r /tmp/k9-los/* || mkdir -p  /tmp/k9-los/
envsubst < /usr/share/nginx/html/public/envVariablesForEnvSubst.json > /tmp/k9-los/env.json

export APP_HOSTNAME="${HOSTNAME:-localhost}"
export APP_PORT="${APP_PORT:-443}"
export APP_NAME="${APP_NAME:-devimg}"
export LOGIN_REDIRECT_URL="${LOGIN_REDIRECT_URL:-http://localhost:8020}"

envsubst '$APP_PORT $APP_HOSTNAME $APP_NAME $K9_LOS_API_URL $LOGIN_REDIRECT_URL $AUTH_PROXY_BASE_URL_WSS $AUTH_PROXY_BASE_URL $AUTH_PROXY_BASE_URL_WSS' < /etc/nginx/conf.d/app.conf.template > /etc/nginx/conf.d/default.conf


echo "### Nginx conf ###"
cat /etc/nginx/conf.d/default.conf

nginx -g "daemon off;" &
pid=$!
wait "$pid"
