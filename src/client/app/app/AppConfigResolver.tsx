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

  const { state: stateK9sakUrl } = useGlobalStateRestApi(RestApiGlobalStatePathsKeys.K9SAK_URL, undefined,
    { suspendRequest: stateNavAnsatt !== RestApiState.SUCCESS, updateTriggers: [stateNavAnsatt] });
  const { state: stateKodeverk } = useGlobalStateRestApi(RestApiGlobalStatePathsKeys.KODEVERK, undefined,
    { suspendRequest: stateNavAnsatt !== RestApiState.SUCCESS, updateTriggers: [stateNavAnsatt] });
  const { state: stateSseUrl } = useGlobalStateRestApi(RestApiGlobalStatePathsKeys.SSE_URL, undefined,
    { suspendRequest: stateNavAnsatt !== RestApiState.SUCCESS, updateTriggers: [stateNavAnsatt] });
  const { state: stateK9punsjUrl } = useGlobalStateRestApi(RestApiGlobalStatePathsKeys.PUNSJ_URL, undefined,
    { suspendRequest: stateNavAnsatt !== RestApiState.SUCCESS, updateTriggers: [stateNavAnsatt] });
  const { state: stateOmsorgspengerUrl } = useGlobalStateRestApi(RestApiGlobalStatePathsKeys.OMSORGSPENGER_URL, undefined,
    { suspendRequest: stateNavAnsatt !== RestApiState.SUCCESS, updateTriggers: [stateNavAnsatt] });

  if (stateNavAnsatt === RestApiState.ERROR) {
    window.location.assign(PROXY_REDIRECT_URL);
  }

  if (stateK9sakUrl === RestApiState.LOADING || stateNavAnsatt === RestApiState.LOADING
      || stateKodeverk === RestApiState.LOADING || stateSseUrl === RestApiState.LOADING
      || stateK9punsjUrl === RestApiState.LOADING || stateOmsorgspengerUrl === RestApiState.LOADING) {
    return <LoadingPanel />;
  }

  return children;
};

export default AppConfigResolver;
