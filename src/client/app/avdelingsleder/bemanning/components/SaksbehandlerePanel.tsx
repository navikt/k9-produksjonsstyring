import React, { FunctionComponent } from 'react';

import Panel from 'nav-frontend-paneler';
import { Saksbehandler } from '../saksbehandlerTsType';
import SaksbehandlereTabell from './SaksbehandlereTabell';

import styles from './saksbehandlereTabell.less';

interface OwnProps {
  saksbehandlere: Saksbehandler[];
  resetSaksbehandlerSok: () => void;
  leggTilSaksbehandler: (epost: string) => Promise<string>;
  fjernSaksbehandler: (epost: string) => Promise<string>;
}

/**
 * SaksbehandlerePanel
 */
const SaksbehandlerePanel: FunctionComponent<OwnProps> = ({
  saksbehandlere,
  resetSaksbehandlerSok,
  leggTilSaksbehandler,
  fjernSaksbehandler,
}) => (
  <Panel className={styles.panel}>
    <SaksbehandlereTabell
      saksbehandlere={saksbehandlere}
      fjernSaksbehandler={fjernSaksbehandler}
      leggTilSaksbehandler={leggTilSaksbehandler}
      resetSaksbehandlerSok={resetSaksbehandlerSok}
    />
  </Panel>
);

export default SaksbehandlerePanel;
