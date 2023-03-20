import { DependencyList, useContext, useEffect, useState } from 'react';
import { K9LosApiKeys } from 'api/k9LosApi';
import { REQUEST_POLLING_CANCELLED } from 'api/rest-api';
import { RestApiRequestContext } from '../RestApiContext';
import RestApiState from '../RestApiState';

interface RestApiData<T> {
	state: RestApiState;
	error?: Error;
	data?: T;
}

/**
 * Hook som utfører et restkall ved mount. En kan i tillegg legge ved en dependencies-liste som kan trigge ny henting når data
 * blir oppdatert. Hook returnerer rest-kallets status/resultat/feil
 */
function useRestApi<T>(
	key: K9LosApiKeys,
	params: any = {},
	keepData = false,
	dependencies: DependencyList = [],
): RestApiData<T> {
	const [data, setData] = useState({
		state: RestApiState.NOT_STARTED,
		error: undefined,
		data: undefined,
	});

	const requestApi = useContext(RestApiRequestContext);

	useEffect(() => {
		setData((oldState) => ({
			state: RestApiState.LOADING,
			error: undefined,
			data: keepData ? oldState.data : undefined,
		}));

		requestApi
			.startRequest(key, params)
			.then((dataRes) => {
				if (dataRes.payload !== REQUEST_POLLING_CANCELLED) {
					setData({
						state: RestApiState.SUCCESS,
						data: dataRes.payload,
						error: undefined,
					});
				}
			})
			.catch((error) => {
				setData({
					state: RestApiState.ERROR,
					data: undefined,
					error,
				});
			});
	}, dependencies);

	return data;
}

export default useRestApi;
