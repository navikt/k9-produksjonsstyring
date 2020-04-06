const express = require('express');
const path = require('path');
const mustacheExpress = require('mustache-express');
const Promise = require('promise');
const compression = require('compression');
const helmet = require('helmet');
const createEnvSettingsFile = require('./src/build/scripts/envSettings');

const server = express();
server.use(helmet());
server.use(compression());
server.set('views', `${__dirname}/dist`);
server.set('view engine', 'mustache');
server.engine('html', mustacheExpress());

createEnvSettingsFile(path.resolve(`${__dirname}/dist/js/settings.js`));

const renderApp = () =>
    new Promise((resolve, reject) => {
        server.render('index.html', {}, (err, html) => {
            if (err) {
                reject(err);
            } else {
                resolve(html);
            }
        });
    });

const startServer = (html) => {
    server.get('/isAlive', (req, res) => res.sendStatus(200));
    server.get('/isReady', (req, res) => res.sendStatus(200));

    server.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });

    const port = process.env.PORT || 8030;
    server.listen(port, () => {
        console.log(`App listening on port: ${port}`);
    });
};

const logError = (errorMessage, details) => console.log(errorMessage, details);

renderApp().then(startServer, (error) => logError('Failed to render app', error));
