var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.dev');

if (process.argv.includes('--no-fix')) {
  console.warn("Setting eslint-loader option 'fix' to false");
  config.module.rules.find(rules => rules.loader === 'eslint-loader').options.fix = false;
}

const options = {
  contentBase: 'src/client',
  proxy: {
    '**/(sprak|api)/**': {
      target: 'http://localhost:8020',
      secure: false,
    },
    '/api/**': {
      target: process.env.APP_URL_LOS || 'http://localhost:8020',
      secure: false,
      changeOrigin: !!process.env.APP_URL_LOS,
      onProxyRes: function onProxyRes(proxyRes, req, res) {
        // For å håndtere redirects på 202 Accepted responser med location headers...
        if (proxyRes.headers.location && proxyRes.headers.location.startsWith(process.env.APP_URL_LOS)) {
          proxyRes.headers.location = proxyRes.headers.location.split(process.env.APP_URL_LOS)[1];
        }
      },
    },
  },
  publicPath: config.output.publicPath,
  hot: true,
  noInfo: true,
  historyApiFallback: {
    index: '/k9los/web/',
  },
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
