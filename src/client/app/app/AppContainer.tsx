import React from 'react';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AppIndex from 'app/AppIndex';
import { RestApiErrorProvider } from 'api/error/RestApiErrorContext';
import { k9LosApi } from 'api/k9LosApi';
import { RestApiProvider } from 'api/rest-api-hooks/src/RestApiContext';
import { config } from 'utils/reactQueryConfig';

const queryClient = new QueryClient(config);
const AppContainer = () => (
	<RestApiErrorProvider>
		<RestApiProvider requestApi={k9LosApi()}>
			<QueryClientProvider client={queryClient}>
				<BrowserRouter>
					<AppIndex />
				</BrowserRouter>
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</RestApiProvider>
	</RestApiErrorProvider>
);

export default AppContainer;
