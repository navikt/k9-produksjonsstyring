import React from 'react';
import { useInnloggetSaksbehandler } from 'api/queries/saksbehandlerQueries';
import IkkeTilgangTilAvdelingslederPanel from 'avdelingsleder/components/IkkeTilgangTilAvdelingslederPanel';
import SaksbehandlerDashboard from './components/SaksbehandlerDashboard';

/**
 * SaksbehandlerIndex
 */

const SaksbehandlerIndex = () => {
	const { data: saksbehandler } = useInnloggetSaksbehandler();
	if (!saksbehandler.kanSaksbehandle) {
		return <IkkeTilgangTilAvdelingslederPanel />;
	}
	return <SaksbehandlerDashboard />;
};

export default SaksbehandlerIndex;
