const path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

const isDevelopment = JSON.stringify(process.env.NODE_ENV) === '"development"';
if (isDevelopment) {
  require('dotenv').config();
}

const CORE_DIR = path.resolve(__dirname, '../node_modules');
const ROOT_DIR = path.resolve(__dirname, '../src/client');
const APP_DIR = path.join(ROOT_DIR, 'app');
const STYLE_DIR = path.join(ROOT_DIR, 'styles');

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
      },
      {
        test: /\.(less|css)?$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: isDevelopment ? './' : '',
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: '[name]_[local]_[contenthash:base64:5]',
              },
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                modules: true,
                localIdentName: '[name]_[local]_[contenthash:base64:5]',
                modifyVars: {
                  nodeModulesPath: '~',
                  coreModulePath: '~',
                },
              },
            },
          },
        ],
        include: [APP_DIR],
      },
      {
        test: /\.(less|css)?$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: isDevelopment ? './' : '',
            },
          },
          {
            loader: 'css-loader',
          },
          {
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
        test: /\.svg/,
        type: 'asset/inline',
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: isDevelopment ? 'style[name].css' : 'style[name]_[contenthash].css',
      ignoreOrder: true,
    }),
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: true,
    }),
    new webpack.EnvironmentPlugin({ AKSJONSPUNKTER_PER_ENHET: false }),
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
    extensions: ['.js', '.jsx', '.tsx', '.ts', '.less'],
  },

  externals: {
    cheerio: 'window',
    'react/addons': 'react',
    'react/lib/ExecutionEnvironment': 'react',
    'react/lib/ReactContext': 'react',
  },
};

module.exports = config;
