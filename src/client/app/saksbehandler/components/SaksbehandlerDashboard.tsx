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
      <div className={styles.oppgaveContainer}>
        <div className={styles.gridContainer}>
          <div className={styles.leftColumn}>
            <Panel className={styles.sakslistePanel}>
              <FagsakSearchIndex
                k9punsjUrl={k9punsjUrl.verdi}
                k9sakUrl={k9sakUrl.verdi}
                omsorgspengerUrl={omsorgspengerUrl.verdi}
              />
            </Panel>
            <div>
              <Panel className={styles.sakslistePanel}>
                <BehandlingskoerIndex
                  k9sakUrl={k9sakUrl.verdi}
                  k9punsjUrl={k9punsjUrl.verdi}
                  setValgtOppgavekoId={setValgtOppgavekoId}
                  valgtOppgavekoId={valgtOppgavekoId}
                  omsorgspengerUrl={omsorgspengerUrl.verdi}
                />
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
