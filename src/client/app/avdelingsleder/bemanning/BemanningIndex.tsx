import React, { FunctionComponent, useEffect } from 'react';
import EnkelTeller from 'avdelingsleder/dagensTall/EnkelTeller';
import { K9LosApiKeys } from 'api/k9LosApi';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { Saksbehandler } from './saksbehandlerTsType';
import SaksbehandlerePanel from './components/SaksbehandlerePanel';

import styles from './components/saksbehandlereTabell.css';

const smallScreen = window.innerWidth < 1650;

/**
 * BemanningIndex
 */
const BemanningIndex: FunctionComponent = () => {
  const { startRequest: hentAlleSaksbehandlere, data: alleSaksbehandlere = [] } = useRestApiRunner<Saksbehandler[]>(
    K9LosApiKeys.SAKSBEHANDLERE,
  );

  useEffect(() => {
    hentAlleSaksbehandlere();
  }, []);

  return (
    <div className={styles.saksbehandlereContent}>
      {!smallScreen && <EnkelTeller antall={alleSaksbehandlere.length} tekst="Saksbehandlere" />}
      <SaksbehandlerePanel saksbehandlere={alleSaksbehandlere} hentAlleSaksbehandlere={hentAlleSaksbehandlere} />
    </div>
  );
};

export default BemanningIndex;
