import React, { FunctionComponent, ReactElement, useEffect } from 'react';
import useRestApiErrorDispatcher from 'api/error/useRestApiErrorDispatcher';
import { RestApiGlobalStatePathsKeys, k9LosApi } from 'api/k9LosApi';
import { useGlobalStateRestApi } from 'api/rest-api-hooks';
import RestApiState from 'api/rest-api-hooks/src/RestApiState';
import LoadingPanel from 'sharedComponents/LoadingPanel';
import { getLoginRedirectUrl } from './envVariablesUtils';

interface OwnProps {
	children: ReactElement;
}

const AppConfigResolver: FunctionComponent<OwnProps> = ({ children }) => {
	const { addErrorMessage } = useRestApiErrorDispatcher();
	useEffect(() => {
		k9LosApi().setAddErrorMessageHandler(addErrorMessage);
	}, []);

	const { state: stateNavAnsatt } = useGlobalStateRestApi(RestApiGlobalStatePathsKeys.NAV_ANSATT);
	const { state: stateK9sakUrl } = useGlobalStateRestApi(RestApiGlobalStatePathsKeys.K9SAK_URL, undefined, {
		suspendRequest: stateNavAnsatt !== RestApiState.SUCCESS,
		updateTriggers: [],
	});
	const { state: stateKodeverk } = useGlobalStateRestApi(RestApiGlobalStatePathsKeys.KODEVERK, undefined, {
		suspendRequest: stateNavAnsatt !== RestApiState.SUCCESS,
		updateTriggers: [],
	});
	const { state: stateSseUrl } = useGlobalStateRestApi(RestApiGlobalStatePathsKeys.REFRESH_URL, undefined, {
		suspendRequest: stateNavAnsatt !== RestApiState.SUCCESS,
		updateTriggers: [],
	});
	const { state: stateK9punsjUrl } = useGlobalStateRestApi(RestApiGlobalStatePathsKeys.PUNSJ_URL, undefined, {
		suspendRequest: stateNavAnsatt !== RestApiState.SUCCESS,
		updateTriggers: [],
	});


	if (
		[stateK9sakUrl, stateNavAnsatt, stateKodeverk, stateSseUrl, stateK9punsjUrl].some((v) => v === RestApiState.LOADING)
	) {
		return <LoadingPanel />;
	}

	return children;
};

export default AppConfigResolver;
