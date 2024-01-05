FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app
COPY package*.json ./

RUN npm install
RUN npx playwright install --with-deps

COPY . .

ENTRYPOINT ["npm", "run", "test:e2e"]