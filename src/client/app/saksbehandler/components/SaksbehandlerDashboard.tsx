import React, { FunctionComponent } from 'react';
import Panel from 'nav-frontend-paneler';

import useGlobalStateRestApiData from 'api/rest-api-hooks/global-data/useGlobalStateRestApiData';
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
  const k9tilbakeUrl = useGlobalStateRestApiData<{ verdi?: string }>(RestApiGlobalStatePathsKeys.K9TILBAKE_URL);

  return (
    <div>
      <div className={styles.oppgaveContainer}>
        <div className={styles.gridContainer}>
          <div className={styles.leftColumn}>
            <div className={styles.sakslisteContent}>
              <Panel className={styles.sakslistePanel}>
                <BehandlingskoerIndex
                  k9sakUrl={k9sakUrl.verdi}
                  k9tilbakeUrl={k9tilbakeUrl.verdi}
                  setValgtOppgavekoId={setValgtOppgavekoId}
                  valgtOppgavekoId={valgtOppgavekoId}
                />
                <FagsakSearchIndex />
              </Panel>
            </div>
          </div>
          <div className={styles.rightColumn}>
            <Panel>
              <SaksstotteIndex />
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaksbehandlerDashboard;
