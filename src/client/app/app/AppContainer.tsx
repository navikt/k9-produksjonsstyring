import React from 'react';
import AppIndex from 'app/AppIndex';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter } from 'react-router-dom';
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
