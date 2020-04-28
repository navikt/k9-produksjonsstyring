const express = require('express');
const path = require('path');
const server = express()
const dotenv = require('dotenv');

server.use(express.static(path.join(__dirname, 'dist')));
const PORT = process.env.PORT || 8030;
const CLUSTER = process.env.NAIS_CLUSTER_NAME;

if (CLUSTER === 'dev-fss') {
    dotenv.config({ path: './config/dev' });
} else if (CLUSTER === 'prod-fss') {
        dotenv.config({ path: './config/prod' });
} else {
        dotenv.config();
}


server.get('/isAlive', (req, res) => res.sendStatus(200));
server.get('/isReady', (req, res) => res.sendStatus(200));

server.get('/k9-los', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

server.get('/avdelingsleder', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

server.listen(PORT);

console.log(`Started express server at port ${PORT}`);
