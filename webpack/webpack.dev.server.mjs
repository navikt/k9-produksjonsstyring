import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { envVariables } from '@k9-los-web/server/envVariables.js';
import config, { PORT } from './webpack.dev.mjs';

if (process.argv.includes('--no-fix')) {
	console.warn("Setting eslint-loader option 'fix' to false");
	config.module.rules.find((rules) => rules.loader === 'eslint-loader').options.fix = false;
}
const options = {
	static: {
		directory: 'src/client',
		watch: true,
	},
	proxy: {
		'/api/k9-los-api': {
			target: 'http://localhost:8020',
			pathRewrite: { '^/api/k9-los-api': '/api' },
			secure: false,
		},
	},
	historyApiFallback: true,
	devMiddleware: {
		publicPath: config.output.publicPath,
		stats: {
			children: false,
			colors: true,
		},
	},
	port: PORT,
	onBeforeSetupMiddleware(devServer) {
		if (!devServer) {
			throw new Error('Webpack Dev Server is not yet available');
		}

		devServer.app.get('/envVariables', (req, res) => {
			res.json(envVariables());
		});
	},
};

const wds = new WebpackDevServer(webpack(config), options);

(async () => {
	try {
		await wds.start();
	} catch (error) {
		return console.log(error); // NOSONAR
	}

	console.log(`Listening at http://localhost:${PORT}/`);
	return undefined;
})();
