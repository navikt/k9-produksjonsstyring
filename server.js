const express = require('express');
const path = require('path');
const helmet = require('helmet');

const server = express();

const isDev = window.location.hostname.includes('dev.adeo.no');
const AUTH_PROXY_URL = isDev ? 'https://k9-los-oidc-auth-proxy.dev.intern.nav.no/api/k9-los-api'
  : 'https://k9-los-oidc-auth-proxy.intern.nav.no/api/k9-los-api';

// @ts-ignore
console.log('AUTH_PROXY_URL', process.env.AUTH_PROXY_URL);

server.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", AUTH_PROXY_URL, 'https://sentry.gc.nav.no'],
        frameSrc: ["'self'", AUTH_PROXY_URL],
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
