import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import commonEnvConfig from './commonEnvConfig.mjs';
import commonDevAndProd from './webpack.common.mjs';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const ROOT_DIR = path.resolve(dirname, '../src/client');
const APP_DIR = path.resolve(ROOT_DIR, 'app');

const config = {
	mode: 'development',
	devtool: 'eval-cheap-module-source-map',

	entry: ['webpack-dev-server/client?http://localhost:8030', 'webpack/hot/only-dev-server', `${APP_DIR}/index.tsx`],

	output: {
		globalObject: 'this',
		filename: '[name].js',
		path: ROOT_DIR,
		publicPath: '/',
	},

	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			favicon: path.join(ROOT_DIR, 'favicon.ico'),
			template: path.join(ROOT_DIR, 'index.html'),
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.EnvironmentPlugin({
			...commonEnvConfig,
			MSW_MODE: process.env.MSW_MODE || 'disabled',
			SENTRY_RELEASE: '',
			VERDIKJEDE: 'false',
		}),
	],

	optimization: {
		moduleIds: 'named',
		splitChunks: {
			chunks: 'all',
		},
	},

	devServer: {
		historyApiFallback: true,
		client: { overlay: false },
	},
};

export default merge(commonDevAndProd, config);
