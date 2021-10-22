const CircularDependencyPlugin = require('circular-dependency-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const { merge } = require('webpack-merge');
const ESLintPlugin = require('eslint-webpack-plugin');
const common = require('./webpack.common.js');

const CORE_DIR = path.resolve(__dirname, '../node_modules');
const ROOT_DIR = path.resolve(__dirname, '../src/client');
const APP_DIR = path.join(ROOT_DIR, 'app');
const STYLE_DIR = path.join(ROOT_DIR, 'styles');

const isDevelopment = JSON.stringify(process.env.NODE_ENV) === '"development"';

const config = {
  module: {
    rules: [
      {
        test: /\.(tsx?|ts?)$/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
        include: APP_DIR,
      }, {
        test: /\.(less|css)?$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: isDevelopment ? './' : '/public',
            },
          }, {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: '[name]_[local]_[hash:base64:5]',
              },
            },
          }, {
            loader: 'less-loader',
            options: {
              lessOptions: {
                modules: true,
                localIdentName: '[name]_[local]_[hash:base64:5]',
                modifyVars: {
                  nodeModulesPath: '~',
                  coreModulePath: '~',
                },
              },
            },
          },
        ],
        include: [APP_DIR],
      }, {
        test: /\.(less|css)?$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: isDevelopment ? './' : '/public',
            },
          }, {
            loader: 'css-loader',
          }, {
            loader: 'less-loader',
            options: {
              lessOptions: {
                modifyVars: {
                  nodeModulesPath: '~',
                  coreModulePath: '~',
                },
              },
            },
          },
        ],
        include: [STYLE_DIR, CORE_DIR],
      }, {
        test: /\.svg/,
        type: 'asset/resource',
      }
    ],
  },

  plugins: [
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: true,
    }),
    new ESLintPlugin({
      extensions: ['ts', 'tsx'],
      fix: false,
      emitError: true,
      emitWarning: true,
      failOnError: true,
    }),
  ],
};

module.exports = merge(common, config);
