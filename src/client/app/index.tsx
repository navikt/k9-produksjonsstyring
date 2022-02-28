import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from 'react-dom';
import { init } from '@sentry/browser';
import { ErrorBoundary } from '@sentry/react';
import { RewriteFrames } from '@sentry/integrations';

import AppIndex from 'app/AppIndex';
import { RestApiProvider } from 'api/rest-api-hooks/src/RestApiContext';
import { k9LosApi } from 'api/k9LosApi';
import { RestApiErrorProvider } from 'api/error/RestApiErrorContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { config } from 'utils/reactQueryConfig';
import '@navikt/ds-css';

/* eslint no-undef: "error" */
const environment = window.location.hostname;

// This allows TypeScript to detect our global value
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      __rootdir__: string;
    }
  }
}

global.__rootdir__ = __dirname || process.cwd();

init({
  dsn: 'https://ee88a0763c614159ba73dbae305f737e@sentry.gc.nav.no/38',
  environment,
  integrations: [
    new RewriteFrames({
      root: global.__rootdir__,
    }),
  ],
});

const renderFunc = Component => {
  const app = document.getElementById('app');
  if (app === null) {
    throw new Error('No app element');
  }

  const queryClient = new QueryClient(config);

  render(
    <ErrorBoundary>
      <BrowserRouter>
        <RestApiProvider requestApi={k9LosApi}>
          <RestApiErrorProvider>
            <QueryClientProvider client={queryClient}>
              <Component />
            </QueryClientProvider>
          </RestApiErrorProvider>
        </RestApiProvider>
      </BrowserRouter>
    </ErrorBoundary>,
    app,
  );
};

renderFunc(AppIndex);
