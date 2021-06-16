import React, { FunctionComponent } from 'react';
import Panel from 'nav-frontend-paneler';

import useGlobalStateRestApiData from 'api/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import FagsakSearchIndex from '../fagsakSearch/FagsakSearchIndex';
import BehandlingskoerIndex from '../behandlingskoer/BehandlingskoerIndex';
import SaksstotteIndex from '../saksstotte/SaksstotteIndex';

import styles from './saksbehandlerDashboard.less';

interface OwnProps {
    valgtOppgavekoId?: string;
    setValgtOppgavekoId: (id: string) => void;
}

/**
 * SaksbehandlerDashboard
 */
export const SaksbehandlerDashboard: FunctionComponent<OwnProps> = ({
  valgtOppgavekoId,
  setValgtOppgavekoId,
}) => {
  const k9sakUrl = useGlobalStateRestApiData<{ verdi?: string }>(RestApiGlobalStatePathsKeys.K9SAK_URL);
  const k9punsjUrl = useGlobalStateRestApiData<{ verdi?: string }>(RestApiGlobalStatePathsKeys.PUNSJ_URL);
  const omsorgspengerUrl = useGlobalStateRestApiData<{ verdi?: string }>(RestApiGlobalStatePathsKeys.OMSORGSPENGER_URL);

  return (
    <div>
      Hei
    </div>
  );
};

export default SaksbehandlerDashboard;
