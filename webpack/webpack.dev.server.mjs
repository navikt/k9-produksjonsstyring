import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { envVariables } from '@k9-los-web/server/envVariables.js';
import config, { PORT } from './webpack.dev.mjs';

if (process.argv.includes('--no-fix')) {
    console.warn("Setting eslint-loader option 'fix' to false");
    config.module.rules.find((rule) => rule.loader === 'eslint-loader').options.fix = false;
}

const options = {
    static: {
        directory: 'src/client',
        watch: true,
    },
    proxy: [
        {
            context: ['/api/k9-los-api'],
            target: 'http://localhost:8020',
            pathRewrite: { '^/api/k9-los-api': '/api' },
            secure: false,
        },
    ],
    historyApiFallback: true,
    devMiddleware: {
        publicPath: config.output.publicPath,
        stats: {
            colors: true,
        },
    },
    port: PORT,
    setupMiddlewares: (middlewares, devServer) => {
        if (!devServer) {
            throw new Error('Webpack Dev Server is not yet available');
        }

        devServer.app.get('/envVariables', (req, res) => {
            res.json(envVariables());
        });

        return middlewares;
    }
};

const server = new WebpackDevServer(options, webpack(config));

(async () => {
    try {
        await server.start();
        console.log(`Listening at http://localhost:${PORT}/`);
    } catch (error) {
        console.error('Error starting server:', error);
    }
})();
