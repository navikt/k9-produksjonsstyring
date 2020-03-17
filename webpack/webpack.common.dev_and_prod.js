const CircularDependencyPlugin = require('circular-dependency-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const PACKAGE = require('./../package.json');
const VERSION = PACKAGE.version;

const CORE_DIR = path.resolve(__dirname, '../node_modules');
const ROOT_DIR = path.resolve(__dirname, '../src/client');
const APP_DIR = path.join(ROOT_DIR, 'app');
const LANG_DIR = path.resolve(APP_DIR, 'sprak/');
const IMG_DIR = path.join(ROOT_DIR, 'images');
const STYLE_DIR = path.join(ROOT_DIR, 'styles');
const CSS_DIR = path.join(ROOT_DIR, 'nomodulestyles');

const isDevelopment = JSON.stringify(process.env.NODE_ENV) === '"development"';

const config = {
  module: {
    rules: [{
        test: /\.(tsx?|ts?)$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          failOnWarning: false,
          failOnError: !isDevelopment,
          configFile: isDevelopment ? './eslint/eslintrc.dev.js' : './eslint/eslintrc.prod.js',
          fix: isDevelopment,
          cache: true,
        },
        include: [APP_DIR],
      }, {
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
              publicPath: isDevelopment ? './' : 'k9-los-web',
            },
          }, {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
              localIdentName: '[name]_[local]_[hash:base64:5]',
            },
          }, {
            loader: 'less-loader',
            options: {
              modules: true,
              localIdentName: '[name]_[local]_[hash:base64:5]',
              modifyVars: {
                nodeModulesPath: '~',
                coreModulePath: '~',
              },
            },
          },
        ],
        include: [APP_DIR, STYLE_DIR],
      }, {
        test: /\.(less|css)?$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: isDevelopment ? './' : 'k9-los-web',
            },
          }, {
            loader: 'css-loader',
          }, {
            loader: 'less-loader',
            options: {
              modifyVars: {
                nodeModulesPath: '~',
                coreModulePath: '~',
              },
            },
          },
        ],
        include: [CSS_DIR, CORE_DIR],
      }, {
        test: /\.(jpg|png|svg)$/,
        loader: 'file-loader',
        options: {
          name: isDevelopment ? '[name]_[hash].[ext]' : '/[name]_[hash].[ext]',
        },
        include: [IMG_DIR],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: isDevelopment ? 'style.css' : 'style_[hash].css',
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      favicon: path.join(ROOT_DIR, 'favicon.ico'),
      template: path.join(ROOT_DIR, 'index.html'),
      version: VERSION,
    }),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(VERSION),
    }),
    new CopyWebpackPlugin([
      {
        from: LANG_DIR,
        to: 'sprak/[name].[ext]',
        force: true,
        cache: {
          key: '[hash]',
        },
      },
    ]),
    // eslint-disable-next-line no-useless-escape
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /nb/),
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: true,
    }),
  ],
};

module.exports = merge(common, config);
