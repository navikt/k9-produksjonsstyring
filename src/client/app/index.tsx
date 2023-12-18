/* eslint-disable global-require */

/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { createRoot } from 'react-dom/client';

import { init } from '@sentry/browser';
import '@navikt/ds-css';
import '@navikt/ft-plattform-komponenter/dist/style.css';

import { setEnvVariables } from 'app/envVariablesUtils';
import AppContainer from 'app/AppContainer';

/* eslint no-undef: "error" */
const environment = window.location.hostname;

init({
	dsn: 'https://ee88a0763c614159ba73dbae305f737e@sentry.gc.nav.no/38',
	release: process.env.SENTRY_RELEASE || 'unknown',
	environment,
});

async function prepare() {
	if (process.env.NODE_ENV !== 'production') {
		return import('../mocks/browser').then(({ worker }) => worker.start({ onUnhandledRequest: 'bypass' }));
	}
	return Promise.resolve();
}

const app = document.getElementById('app');
if (app === null) {
	throw new Error('No app element');
}
const root = createRoot(app);
async function bootstrap() {
	await setEnvVariables();

	root.render(<AppContainer />);
}

prepare().then(() => {
	bootstrap();
});
