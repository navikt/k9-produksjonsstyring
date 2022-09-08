const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ROOT_DIR = path.resolve(__dirname, '../src/client');
const APP_DIR = path.join(ROOT_DIR, 'app');
const CORE_DIR = path.resolve(__dirname, '../node_modules');
const CSS_DIR = path.join(ROOT_DIR, 'styles');
const STORYBOOK_DIR = path.resolve(__dirname);

module.exports = {
  core: {
    builder: 'webpack5',
  },
  addons: ['@storybook/addon-essentials'],
  framework: '@storybook/react',
  stories: ['../src/client/storybook/stories/*.@(ts|tsx)'],
  webpackFinal: async config => {
    config.devtool = 'eval-cheap-module-source-map';

    config.module.rules = config.module.rules.concat(
      {
        test: /\.(less|css)?$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: './',
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: '[name]_[local]_[hash:base64:5]',
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
        include: [ROOT_DIR],
        exclude: [CSS_DIR],
      },
      {
        test: /\.(less)?$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: './',
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
        include: [CSS_DIR, CORE_DIR, STORYBOOK_DIR],
      },
    );

    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: 'style[name].css',
        ignoreOrder: true,
      }),
    );

    config.resolve.alias = {
      styles: path.join(ROOT_DIR, 'styles'),
      images: path.join(ROOT_DIR, 'images'),
      testHelpers: path.join(ROOT_DIR, 'testHelpers'),
      app: path.join(APP_DIR, 'app'),
      types: path.join(APP_DIR, 'types'),
      navAnsatt: path.join(APP_DIR, 'navAnsatt'),
      form: path.join(APP_DIR, 'form'),
      saksbehandler: path.join(APP_DIR, 'saksbehandler'),
      avdelingsleder: path.join(APP_DIR, 'avdelingsleder'),
      aktoer: path.join(APP_DIR, 'aktoer'),
      api: path.join(APP_DIR, 'api'),
      kodeverk: path.join(APP_DIR, 'kodeverk'),
      sharedComponents: path.join(APP_DIR, 'sharedComponents'),
      utils: path.join(APP_DIR, 'utils'),
    };
    config.resolve.extensions.push('.ts', '.tsx', '.less');

    return config;
  },
};
