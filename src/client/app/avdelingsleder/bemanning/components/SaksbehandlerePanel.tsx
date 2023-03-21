import React, { FunctionComponent } from 'react';
import Panel from 'nav-frontend-paneler';
import SaksbehandlereTabell from './SaksbehandlereTabell';
import styles from './saksbehandlereTabell.css';

/**
 * SaksbehandlerePanel
 */
const SaksbehandlerePanel: FunctionComponent = () => (
	<Panel className={styles.panel}>
		<SaksbehandlereTabell />
	</Panel>
);

export default SaksbehandlerePanel;
