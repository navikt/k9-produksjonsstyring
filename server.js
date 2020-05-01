const express = require('express');
const path = require('path');
const server = express()

server.use(express.static(path.join(__dirname, 'dist')));
const PORT = process.env.PORT || 8030;

server.use('/dist/js', express.static(path.resolve(__dirname, 'dist/js')));
server.use('/dist/css', express.static(path.resolve(__dirname, 'dist/css')));
server.use('/dist/favicon.png', express.static(path.resolve(__dirname, 'dist/favicon.png')));

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
