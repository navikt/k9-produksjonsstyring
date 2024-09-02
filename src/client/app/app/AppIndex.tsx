import React, { FunctionComponent, useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { useLocation } from 'react-router';
import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { Button, Modal } from '@navikt/ds-react';
import { parseQueryString } from 'utils/urlUtils';
import '../../styles/global.css';
import AppConfigResolver from './AppConfigResolver';
import ErrorBoundary from './ErrorBoundary';
import LanguageProvider from './LanguageProvider';
import HeaderWithErrorPanel from './components/HeaderWithErrorPanel';
import Home from './components/Home';

/**
 * AppIndex
 *
 * Container komponent. Dette er toppkomponenten i applikasjonen. Denne vil rendre header
 * og home-komponentene. Home-komponenten vil rendre barn-komponenter via ruter.
 * Komponenten er også ansvarlig for å hente innlogget NAV-ansatt, rettskilde-url,
 * og kodeverk fra server og lagre desse i klientens state.
 */
const AppIndex: FunctionComponent = () => {
	const [crashMessage, setCrashMessage] = useState<string>();
	const [sessionHarUtlopt, setSessionHarUtlopt] = useState<boolean>(false);
	const timeout = 1000 * 60 * 58;

	const handleOnIdle = (): void => {
		setSessionHarUtlopt(true);
	};

	useIdleTimer({
		timeout,
		onIdle: handleOnIdle,
	});

	const addErrorMessageAndSetAsCrashed = (error: string) => {
		setCrashMessage(error);
	};

	const location = useLocation();
	const queryStrings = parseQueryString(location.search);

	return <>testolini 1234 </>;
};

export default AppIndex;
