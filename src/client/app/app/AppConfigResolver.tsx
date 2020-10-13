import React, { FunctionComponent, ReactElement } from 'react';

import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import LoadingPanel from 'sharedComponents/LoadingPanel';
import { useGlobalStateRestApi } from 'api/rest-api-hooks';
import RestApiState from 'api/rest-api-hooks/src/RestApiState';

interface OwnProps {
  children: ReactElement;
}

const isDev = window.location.hostname.includes('dev.adeo.no');
const PROXY_REDIRECT_URL = isDev ? 'https://k9-los-oidc-auth-proxy.dev.adeo.no/login?redirect_uri=https://k9-los-web.dev.adeo.no/'
  : 'https://k9-los-oidc-auth-proxy.nais.adeo.no/login?redirect_uri=https://k9-los-web.nais.adeo.no/';

const AppConfigResolver: FunctionComponent<OwnProps> = ({
  children,
}) => {
  const { state: stateNavAnsatt } = useGlobalStateRestApi(RestApiGlobalStatePathsKeys.NAV_ANSATT);
  const { state: stateK9sakUrl } = useGlobalStateRestApi(RestApiGlobalStatePathsKeys.K9SAK_URL);
  const { state: stateKodeverk } = useGlobalStateRestApi(RestApiGlobalStatePathsKeys.KODEVERK);
  const { state: stateSseUrl } = useGlobalStateRestApi(RestApiGlobalStatePathsKeys.SSE_URL);

  if (stateNavAnsatt === RestApiState.LOADING || stateK9sakUrl === RestApiState.LOADING
      || stateKodeverk === RestApiState.LOADING || stateSseUrl === RestApiState.LOADING) {
    return <LoadingPanel />;
  }

  if (stateNavAnsatt === RestApiState.ERROR || stateK9sakUrl === RestApiState.ERROR
      || stateKodeverk === RestApiState.ERROR || stateSseUrl === RestApiState.ERROR) {
    window.location.assign(PROXY_REDIRECT_URL);
  }

  return children;
};

export default AppConfigResolver;
