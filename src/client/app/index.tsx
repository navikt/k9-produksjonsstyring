import React from 'react';
import { Router } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { render } from 'react-dom';
import { init } from '@sentry/browser';

import AppIndex from 'app/AppIndex';
import { RestApiProvider } from 'api/rest-api-hooks/src/RestApiContext';
import { RestApiErrorProvider } from 'api/rest-api/error/RestApiErrorContext';
import { k9LosApi } from 'api/k9LosApi';

/* eslint no-undef: "error" */
const environment = window.location.hostname;

init({
  dsn: 'https://ee88a0763c614159ba73dbae305f737e@sentry.gc.nav.no/38',
  environment,
});

const history = createBrowserHistory({
  basename: '',
});

const renderFunc = (Component) => {
  const app = document.getElementById('app');
  if (app === null) {
    throw new Error('No app element');
  }
  render(
    <Router history={history}>
      <RestApiProvider requestApi={k9LosApi}>
        <RestApiErrorProvider>
          <Component />
        </RestApiErrorProvider>
      </RestApiProvider>
    </Router>,
    app,
  );
};

renderFunc(AppIndex);
