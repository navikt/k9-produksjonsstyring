import React, { FunctionComponent, ReactElement } from 'react';

import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import LoadingPanel from 'sharedComponents/LoadingPanel';
import { RestApiState, useGlobalStateRestApi } from 'api/rest-api-hooks';

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
  const { state: stateDriftsmeldinger } = useGlobalStateRestApi(RestApiGlobalStatePathsKeys.DRIFTSMELDINGER);

  if (stateNavAnsatt === RestApiState.LOADING
      || stateKodeverk === RestApiState.LOADING
      || stateK9sakUrl === RestApiState.LOADING
      || stateSsseUrl === RestApiState.LOADING
      || stateDriftsmeldinger === RestApiState.LOADING) {
    return <LoadingPanel />;
  }
  return children;
};

export default AppConfigResolver;
