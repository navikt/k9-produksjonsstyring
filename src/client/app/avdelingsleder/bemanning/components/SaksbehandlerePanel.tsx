import React, { FunctionComponent } from 'react';
import Panel from 'nav-frontend-paneler';
import { Saksbehandler } from 'avdelingsleder/bemanning/saksbehandlerTsType';
import SaksbehandlereTabell from './SaksbehandlereTabell';
import styles from './saksbehandlereTabell.css';

interface OwnProps {
  saksbehandlere: Saksbehandler[];
  hentAlleSaksbehandlere: () => void;
}

/**
 * SaksbehandlerePanel
 */
const SaksbehandlerePanel: FunctionComponent<OwnProps> = ({ saksbehandlere, hentAlleSaksbehandlere }) => (
  <Panel className={styles.panel}>
    <SaksbehandlereTabell saksbehandlere={saksbehandlere} hentAlleSaksbehandlere={hentAlleSaksbehandlere} />
  </Panel>
);

export default SaksbehandlerePanel;
