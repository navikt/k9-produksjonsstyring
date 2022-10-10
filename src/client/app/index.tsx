import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from 'react-dom';
import { init } from '@sentry/browser';

import AppIndex from 'app/AppIndex';
import { RestApiProvider } from 'api/rest-api-hooks/src/RestApiContext';
import { k9LosApi } from 'api/k9LosApi';
import { RestApiErrorProvider } from 'api/error/RestApiErrorContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { config } from 'utils/reactQueryConfig';
import '@navikt/ds-css';
import '@navikt/ft-plattform-komponenter/dist/style.css';

/* eslint no-undef: "error" */
const environment = window.location.hostname;

init({
  dsn: 'https://ee88a0763c614159ba73dbae305f737e@sentry.gc.nav.no/38',
  release: process.env.SENTRY_RELEASE || 'unknown',
  environment,
});

const renderFunc = Component => {
  const app = document.getElementById('app');
  if (app === null) {
    throw new Error('No app element');
  }

  const queryClient = new QueryClient(config);

  render(
    <BrowserRouter>
      <RestApiProvider requestApi={k9LosApi}>
        <RestApiErrorProvider>
          <QueryClientProvider client={queryClient}>
            <Component />
          </QueryClientProvider>
        </RestApiErrorProvider>
      </RestApiProvider>
    </BrowserRouter>,
    app,
  );
};

renderFunc(AppIndex);
