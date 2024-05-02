import React from 'react';
import { FormattedMessage } from 'react-intl';
import Panel from 'nav-frontend-paneler';
import { Undertittel } from 'nav-frontend-typografi';
import * as styles from './ikkeTilgangTilAvdelingslederPanel.css';

/**
 * IkkeTilgangTilAvdelingslederPanel
 */
const IkkeTilgangTilAvdelingslederPanel = () => (
	<Panel className={styles.container}>
		<Undertittel>
			<FormattedMessage id="IkkeTilgangTilAvdelingslederPanel.HarIkkeTilgang" />
		</Undertittel>
	</Panel>
);

export default IkkeTilgangTilAvdelingslederPanel;
