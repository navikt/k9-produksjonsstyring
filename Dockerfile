FROM node:alpine

LABEL org.opencontainers.image.source=https://github.com/navikt/k9-los-web

WORKDIR /usr/src/client/app

COPY dist ./dist
COPY server.js .
COPY node_modules ./node_modules
COPY package.json .

EXPOSE 8030
CMD ["yarn", "config", "set", "prefix", "/tmp/yarn"]
CMD ["yarn", "config", "set", "cache-folder", "/tmp/yarn_cache"]
CMD ["yarn", "run", "start-express"]