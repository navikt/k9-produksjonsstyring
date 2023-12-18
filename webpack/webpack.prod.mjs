import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import CopyPlugin from 'copy-webpack-plugin';
import commonDevAndProd from './webpack.common.mjs';

const dirname = path.dirname(new URL(import.meta.url).pathname);
const ROOT_DIR = path.resolve(dirname, '../src/client');
const APP_DIR = path.resolve(ROOT_DIR, 'app');

const config = {
	mode: 'production',
	devtool: 'source-map',
	performance: { hints: false },

	entry: [`${APP_DIR}/index.tsx`],

	output: {
		globalObject: 'this',
		filename: '[name].[contenthash].js',
		chunkFilename: '[id].[chunkhash].chunk.js',
		path: path.resolve(dirname, '../dist/public'),
		publicPath: '/public/',
	},

	plugins: [
		new HtmlWebpackPlugin({
			filename: '../index.html',
			favicon: path.join(ROOT_DIR, 'favicon.ico'),
			template: path.join(ROOT_DIR, 'index.html'),
		}),
		new webpack.EnvironmentPlugin({ SENTRY_RELEASE: null }),
		new CopyPlugin({
			patterns: [{ from: 'webpack/envVariablesForEnvSubst.json', to: 'envVariablesForEnvSubst.json' }],
		}),
	],

	optimization: {
		minimizer: [
			new TerserPlugin({
				parallel: true,
			}),
			new CssMinimizerPlugin(),
		],
		splitChunks: {
			chunks: 'all',
		},
	},

	stats: {
		children: false,
	},
};

export default merge(commonDevAndProd, config);
