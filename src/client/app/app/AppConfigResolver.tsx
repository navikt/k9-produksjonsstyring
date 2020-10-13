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
  const { state: stateNavAnsatt } = useRestApiRunner(K9LosApiKeys.NAV_ANSATT);
  const { state: stateKodeverk } = useRestApiRunner(K9LosApiKeys.KODEVERK);
  const { state: stateK9sakUrl } = useRestApiRunner(K9LosApiKeys.K9SAK_URL);
  const { state: stateSsseUrl } = useRestApiRunner(K9LosApiKeys.SSE_URL);

  if (stateNavAnsatt === RestApiState.LOADING
      || stateKodeverk === RestApiState.LOADING
      || stateK9sakUrl === RestApiState.LOADING
      || stateSsseUrl === RestApiState.LOADING) {
    return <LoadingPanel />;
  }
  return children;
};

export default AppConfigResolver;
