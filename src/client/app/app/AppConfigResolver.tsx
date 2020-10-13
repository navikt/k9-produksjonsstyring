import React, { FunctionComponent, ReactElement } from 'react';

import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import LoadingPanel from 'sharedComponents/LoadingPanel';
import { RestApiState, useGlobalStateRestApi, useRestApiRunner } from 'api/rest-api-hooks';

interface OwnProps {
  children: ReactElement;
}

const AppConfigResolver: FunctionComponent<OwnProps> = ({
  children,
}) => {
  const { state: stateNavAnsatt } = useGlobalStateRestApi(RestApiGlobalStatePathsKeys.NAV_ANSATT);
  const { state: stateKodeverk } = useGlobalStateRestApi(RestApiGlobalStatePathsKeys.KODEVERK);
  const { state: stateK9sakUrl } = useGlobalStateRestApi(RestApiGlobalStatePathsKeys.K9SAK_URL);
  const { state: stateSsseUrl } = useGlobalStateRestApi(RestApiGlobalStatePathsKeys.SSE_URL);

  if (stateNavAnsatt === RestApiState.LOADING
      || stateKodeverk === RestApiState.LOADING
      || stateK9sakUrl === RestApiState.LOADING
      || stateSsseUrl === RestApiState.LOADING) {
    return <LoadingPanel />;
  }
  return children;
};

export default AppConfigResolver;
