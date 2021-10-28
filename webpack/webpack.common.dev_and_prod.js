const CircularDependencyPlugin = require('circular-dependency-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

const CORE_DIR = path.resolve(__dirname, '../node_modules');
const ROOT_DIR = path.resolve(__dirname, '../src/client');
const APP_DIR = path.join(ROOT_DIR, 'app');
const STYLE_DIR = path.join(ROOT_DIR, 'styles');
const IMG_DIR = path.join(ROOT_DIR, 'images');

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
      },
      {
        test: /\.(jp|pn|sv)g$/,
        issuer: /\.less$/,
        type: 'asset/resource',
        generator: {
          filename: '[name]_[contenthash].[ext]',
        },
        include: [IMG_DIR],
      },
      {
        test: /\.(svg)$/,
        type: 'asset/resource',
        include: [IMG_DIR],
      },
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

  resolve: {
    alias: {
      styles: path.join(ROOT_DIR, 'styles'),
      images: path.join(ROOT_DIR, 'images'),
      testHelpers: path.join(ROOT_DIR, 'testHelpers'),
      app: path.join(APP_DIR, 'app'),
      navAnsatt: path.join(APP_DIR, 'navAnsatt'),
      form: path.join(APP_DIR, 'form'),
      saksbehandler: path.join(APP_DIR, 'saksbehandler'),
      avdelingsleder: path.join(APP_DIR, 'avdelingsleder'),
      aktoer: path.join(APP_DIR, 'aktoer'),
      api: path.join(APP_DIR, 'api'),
      kodeverk: path.join(APP_DIR, 'kodeverk'),
      sharedComponents: path.join(APP_DIR, 'sharedComponents'),
      utils: path.join(APP_DIR, 'utils'),
    },
    extensions: ['.json', '.js', '.tsx', '.ts', '.less'],
  },

  externals: {
    cheerio: 'window',
    'react/addons': 'react',
    'react/lib/ExecutionEnvironment': 'react',
    'react/lib/ReactContext': 'react',
  },
};

module.exports = config;
