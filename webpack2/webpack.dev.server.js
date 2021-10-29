var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.dev');

if (process.argv.includes('--no-fix')) {
  console.warn("Setting eslint-loader option 'fix' to false");
  config.module.rules.find(rules => rules.loader === 'eslint-loader').options.fix = false;
}

const options = {
  static: {
    directory: 'src/client',
    watch: true,
  },
  proxy: {
    '/api/**': {
      target: 'http://localhost:8020',
      secure: false,
      changeOrigin: !!'http://localhost:8020',
      onProxyRes: function onProxyRes(proxyRes, req, res) {
        // For å håndtere redirects på 202 Accepted responser med location headers...
        if (proxyRes.headers.location && proxyRes.headers.location.startsWith(process.env.AUTH_PROXY_URL)) {
          proxyRes.headers.location = proxyRes.headers.location.split(process.env.AUTH_PROXY_URL)[1];
        }
      },
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
  port: 8030,
};

const wds = new WebpackDevServer(webpack(config), options);

(async () => {
  try {
    await wds.start();
  } catch (error) {
    return console.log(err); // NOSONAR
  }

  console.log('Listening at http://localhost:8030/');
  return undefined;
})();
