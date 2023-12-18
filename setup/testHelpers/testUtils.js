import React from 'react';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { render as rtlRender } from '@testing-library/react';
import kodeverk from 'mocks/kodeverk';
import { k9LosApi } from 'api/k9LosApi';
import { RestApiProvider } from 'api/rest-api-hooks/src/RestApiContext';
import { config } from 'utils/reactQueryConfig';
import defaultMessages from '../../src/client/app/sprak/nb_NO.json';

export function renderWithIntl(ui, { locale, messages, ...renderOptions } = {}) {
	const Wrapper = ({ children }) => (
		<IntlProvider locale={locale || 'nb-NO'} messages={messages || defaultMessages}>
			{children}
		</IntlProvider>
	);

	return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

export const renderWithAllProviders = (ui, { ...renderOptions } = {}) => {
	const queryClient = new QueryClient(config);
	const Wrapper = ({ children }) => (
		<BrowserRouter>
			<RestApiProvider
				requestApi={k9LosApi()}
				initialState={{ KODEVERK: kodeverk, NAV_ANSATT: { navn: 'Paul', brukernavn: 'pingpongpaul@nav.no' } }}
			>
				<QueryClientProvider client={queryClient}>
					<IntlProvider locale="nb-NO" defaultLocale="nb-NO" messages={defaultMessages}>
						{children}
					</IntlProvider>
				</QueryClientProvider>
			</RestApiProvider>
		</BrowserRouter>
	);
	return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};
