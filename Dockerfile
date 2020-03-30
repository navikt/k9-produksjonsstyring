FROM nginx:1.17.8-alpine

# bash er ikke standard i alpine:
RUN apk add --no-cache bash

ADD nginx.conf /etc/nginx/conf.d/app.conf.template

ENV APP_DIR="client/app" \
  APP_PATH_PREFIX="/k9-los" \
  APP_CALLBACK_PATH="/k9-los/cb" \
  APP_URL_FPTILBAKE="http://fptilbake" \
  APP_URL_LOS="http://k9-los-api"
  APPLICATION_BASE_URL="http://k9-los-web/k9los/web"

COPY dist /usr/share/nginx/html

EXPOSE 8030 443

# using bash over sh for better signal-handling
SHELL ["/bin/bash", "-c"]
ADD start-server.sh /start-server.sh
CMD /start-server.sh

