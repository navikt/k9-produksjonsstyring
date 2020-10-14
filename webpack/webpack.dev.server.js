const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.dev');

if (process.argv.includes('--no-fix')) {
  console.warn("Setting eslint-loader option 'fix' to false");
  config.module.rules.find((rules) => rules.loader === 'eslint-loader').options.fix = false;
}

const options = {
  contentBase: 'src/client',
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
  publicPath: config.output.publicPath,
  hot: true,
  noInfo: true,
  historyApiFallback: true,
  stats: {
    children: false,
    colors: true,
  },
};

const wds = new WebpackDevServer(webpack(config), options);

wds.listen(8030, 'localhost', (err) => {
  if (err) {
    return console.log(err); // NOSONAR
  }

  console.log('Listening at http://localhost:8030/');
  return null;
});
