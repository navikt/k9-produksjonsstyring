FROM node:alpine

WORKDIR /usr/src/app

COPY dist ./dist
COPY server.js .
COPY node_modules ./node_modules
COPY package.json .
COPY envSettings.sh ./envSettings.sh

EXPOSE 8030
CMD ["npm", "run", "start-express"]

