import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import { render } from 'react-dom';
import { init } from '@sentry/browser';

import AppIndex from 'app/AppIndex';
import configureStore from './store';

/* eslint no-undef: "error" */
const environment = window.location.hostname;

init({
  dsn: 'https://d863105541bf4d0cb030dd4c6bfb4d05@sentry.gc.nav.no/10',
  environment,
});


const history = createBrowserHistory({
  basename: '/k9los/web/',
});
const store = configureStore(history);

const renderFunc = (Component) => {
  const app = document.getElementById('app');
  if (app === null) {
    throw new Error('No app element');
  }
  render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Component />
      </ConnectedRouter>
    </Provider>,
    app,
  );
};

renderFunc(AppIndex);
