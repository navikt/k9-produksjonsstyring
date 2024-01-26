import React from 'react';
import NavAnsatt from 'app/navAnsattTsType';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import useGlobalStateRestApiData from 'api/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import IkkeTilgangTilAvdelingslederPanel from 'avdelingsleder/components/IkkeTilgangTilAvdelingslederPanel';
import SaksbehandlerDashboard from './components/SaksbehandlerDashboard';

/**
 * SaksbehandlerIndex
 */

const SaksbehandlerIndex = () => {
	const { kanSaksbehandle } = useGlobalStateRestApiData<NavAnsatt>(RestApiGlobalStatePathsKeys.NAV_ANSATT);
	if (!kanSaksbehandle) {
		return <IkkeTilgangTilAvdelingslederPanel />;
	}
	return <SaksbehandlerDashboard />;
};

export default SaksbehandlerIndex;
