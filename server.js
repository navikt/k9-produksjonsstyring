const express = require('express');
const path = require('path');
const helmet = require('helmet');
require('dotenv').config();

const server = express();

console.log('AUTH_PROXY_URL', process.env.AUTH_PROXY_URL)

server.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", process.env.AUTH_PROXY_BASE_URL, 'https://sentry.gc.nav.no'],
        frameSrc: ["'self'", process.env.AUTH_PROXY_URL],
        fontSrc: ["'self'", 'data:'],
        imgSrc: ["'self'", 'data:'],
      },
    },
  })
);

server.use(express.static(path.join(__dirname, 'dist')));
const PORT = process.env.PORT || 8030;

server.get('/isAlive', (req, res) => res.sendStatus(200));
server.get('/isReady', (req, res) => res.sendStatus(200));

server.get(/^\/(?!.*dist).*$/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

server.listen(PORT);

console.log(`Started express server at port ${PORT}`);
