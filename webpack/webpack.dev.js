const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const commonDevAndProd = require('./webpack.common.js');

const ROOT_DIR = path.resolve(__dirname, '../src/client');
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
    new webpack.EnvironmentPlugin({ MSW_MODE: process.env.MSW_MODE || 'disabled', SENTRY_RELEASE: '' }),
  ],

  optimization: {
    moduleIds: 'named',
    splitChunks: {
      chunks: 'all',
    },
  },

  devServer: {
    historyApiFallback: true,
  },
};

module.exports = merge(commonDevAndProd, config);
