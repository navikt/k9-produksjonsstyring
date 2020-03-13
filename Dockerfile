FROM nginx:1.17.8-alpine

# bash er ikke standard i alpine:
RUN apk add --no-cache bash

ENV APP_DIR="client/app" \
  APP_PATH_PREFIX="/k9-los" \
  APP_CALLBACK_PATH="/k9-los/cb" \
  APP_URL_FPTILBAKE="http://fptilbake" \
  APP_URL_SAK="http://k9-los"

COPY dist /usr/share/nginx/html

EXPOSE 8030 443


# using bash over sh for better signal-handling
SHELL ["/bin/bash", "-c"]
ADD start-server.sh /start-server.sh
CMD /start-server.sh

