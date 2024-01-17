FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app
COPY package*.json ./

RUN yarn install
RUN npx playwright install --with-deps


COPY . .

ENTRYPOINT ["yarn", "test:e2e"]