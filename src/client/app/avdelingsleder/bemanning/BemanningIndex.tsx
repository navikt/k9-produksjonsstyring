import React, { FunctionComponent, useContext } from 'react';
import { AvdelingslederContext } from 'avdelingsleder/context';
import EnkelTeller from 'avdelingsleder/dagensTall/EnkelTeller';
import SaksbehandlerePanel from './components/SaksbehandlerePanel';
import styles from './components/saksbehandlereTabell.css';

const smallScreen = window.innerWidth < 1650;

/**
 * BemanningIndex
 */
const BemanningIndex: FunctionComponent = () => {
	const { saksbehandlere: alleSaksbehandlere } = useContext(AvdelingslederContext);

	return (
		<div className={styles.saksbehandlereContent}>
			{!smallScreen && <EnkelTeller antall={alleSaksbehandlere.length} tekst="Saksbehandlere" />}
			<SaksbehandlerePanel />
		</div>
	);
};

export default BemanningIndex;
