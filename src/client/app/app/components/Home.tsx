import React, { FunctionComponent, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Route, Routes } from 'react-router-dom';
import { withSentryReactRouterV6Routing } from '@sentry/react';
import AppContext from 'app/AppContext';
import NavAnsatt from 'app/navAnsattTsType';
import apiPaths from 'api/apiPaths';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import { useGlobalStateRestApiData } from 'api/rest-api-hooks';
import AvdelingslederIndex from 'avdelingsleder/AvdelingslederIndex';
import { Oppgavefelt } from 'filter/filterTsTypes';
import SaksbehandlerIndex from 'saksbehandler/SaksbehandlerIndex';
import AdminIndex from '../../admin/AdminIndex';
import FilterIndex from '../../filter/FilterIndex';
import MissingPage from './MissingPage';

/**
 * Home
 *
 * Presentasjonskomponent. Wrapper for sideinnholdet som vises under header.
 */

const SentryRoutes = withSentryReactRouterV6Routing(Routes);
const Home: FunctionComponent = () => {
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
		<div className="mt-5">
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
