import React, { FunctionComponent, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Route, Routes } from 'react-router-dom';
import { withSentryReactRouterV6Routing } from '@sentry/react';
import AppContext from 'app/AppContext';
import apiPaths from 'api/apiPaths';
import { useInnloggetSaksbehandler } from 'api/queries/saksbehandlerQueries';
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
	const { data: saksbehandler } = useInnloggetSaksbehandler();

	const queryClient = useQueryClient();

	useEffect(() => {
		if (saksbehandler.brukerIdent) {
			if (saksbehandler.kanOppgavestyre) {
				queryClient.prefetchQuery(apiPaths.hentSaksbehandlereAvdelingsleder);
			}
			queryClient.prefetchQuery(apiPaths.hentSaksbehandlereSomSaksbehandler);
		}
	}, [queryClient, saksbehandler.brukerIdent, saksbehandler.kanOppgavestyre]);

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
