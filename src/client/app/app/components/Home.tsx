import React, { FunctionComponent, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Route, Routes } from 'react-router-dom';
import AppContext from 'app/AppContext';
import apiPaths from 'api/apiPaths';
import AvdelingslederIndex from 'avdelingsleder/AvdelingslederIndex';
import { Oppgavefelt } from 'filter/filterTsTypes';
import { withSentryReactRouterV6Routing } from '@sentry/react';
import SaksbehandlerIndex from 'saksbehandler/SaksbehandlerIndex';
import AdminIndex from '../../admin/AdminIndex';
import FilterIndex from '../../filter/FilterIndex';
import MissingPage from './MissingPage';
import { useGlobalStateRestApi, useGlobalStateRestApiData } from 'api/rest-api-hooks';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import NavAnsatt from 'app/navAnsattTsType';

interface OwnProps {
	headerHeight: number;
}

/**
 * Home
 *
 * Presentasjonskomponent. Wrapper for sideinnholdet som vises under header.
 */

const SentryRoutes = withSentryReactRouterV6Routing(Routes);
const Home: FunctionComponent<OwnProps> = ({ headerHeight }) => {
	const { data } = useQuery<{ felter: Oppgavefelt[] }>(apiPaths.hentOppgaveFelter);
	const { kanOppgavestyre, brukerIdent } = useGlobalStateRestApiData<NavAnsatt>(RestApiGlobalStatePathsKeys.NAV_ANSATT);

	const queryClient = useQueryClient();

	useEffect(() => {
		if (brukerIdent) {
			if (kanOppgavestyre) {
				queryClient.prefetchQuery(apiPaths.hentSaksbehandlereAvdelingsleder);
			}
			queryClient.prefetchQuery(apiPaths.hentSaksbehandlereSomSaksbehandler);
		}
	}, [queryClient, brukerIdent, kanOppgavestyre]);

	const contextValues = useMemo(() => ({ felter: data ? data.felter : [] }), [data]);

	return (
		<div style={{ margin: `${headerHeight + 10}px auto 0` }}>
			<AppContext.Provider value={contextValues}>
				<SentryRoutes>
					<Route path="/filter" element={<FilterIndex tittel="Søk på oppgaver" visningV3 />} />
					<Route path="/" element={<SaksbehandlerIndex />} />
					<Route path="/avdelingsleder" element={<AvdelingslederIndex />} />
					<Route path="/admin" element={<AdminIndex />} />
					<Route path="*" element={<MissingPage />} />
				</SentryRoutes>
			</AppContext.Provider>
		</div>
	);
};

export default Home;
