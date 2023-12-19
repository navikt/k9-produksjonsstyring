import React, { FunctionComponent, ReactElement, useEffect } from 'react';
import useRestApiErrorDispatcher from 'api/error/useRestApiErrorDispatcher';
import { RestApiGlobalStatePathsKeys, k9LosApi } from 'api/k9LosApi';
import { useGlobalStateRestApi } from 'api/rest-api-hooks';
import RestApiState from 'api/rest-api-hooks/src/RestApiState';
import LoadingPanel from 'sharedComponents/LoadingPanel';

interface OwnProps {
	children: ReactElement;
}

const isDev = window.location.hostname.includes('dev.adeo.no');
const PROXY_REDIRECT_URL = isDev
	? 'https://k9-los-oidc-auth-proxy.dev.intern.nav.no/login?redirect_uri=https://k9-los-web.dev.adeo.no/'
	: 'https://k9-los-oidc-auth-proxy.intern.nav.no/login?redirect_uri=https://k9-los-web.nais.adeo.no/';

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

	if (stateNavAnsatt === RestApiState.ERROR) {
		window.location.assign(PROXY_REDIRECT_URL);
	}

	if (
		[stateK9sakUrl, stateNavAnsatt, stateKodeverk, stateSseUrl, stateK9punsjUrl].some((v) => v === RestApiState.LOADING)
	) {
		return <LoadingPanel />;
	}

	return children;
};

export default AppConfigResolver;
