import React, { FunctionComponent, useMemo } from 'react';
import { useQuery } from 'react-query';
import { Route, Routes } from 'react-router-dom';
import AppContext from 'app/AppContext';
import apiPaths from 'api/apiPaths';
import AvdelingslederIndex from 'avdelingsleder/AvdelingslederIndex';
import { Oppgavefelt } from 'filter/filterTsTypes';
import SaksbehandlerIndex from 'saksbehandler/SaksbehandlerIndex';
import AdminIndex from '../../admin/AdminIndex';
import AktoerIndex from '../../aktoer/AktoerIndex';
import FilterIndex from '../../filter/FilterIndex';
import MissingPage from './MissingPage';
import styles from './home.css';

export const aktoerPath = '/aktoer/:aktoerId(\\d+)';

interface OwnProps {
	headerHeight: number;
}

/**
 * Home
 *
 * Presentasjonskomponent. Wrapper for sideinnholdet som vises under header.
 */
const Home: FunctionComponent<OwnProps> = ({ headerHeight }) => {
	const { data } = useQuery<{ felter: Oppgavefelt[] }>(apiPaths.hentOppgaveFelter);
	const contextValues = useMemo(() => ({ felter: data ? data.felter : [] }), [data]);

	return (
		<div className={styles.content} style={{ margin: `${headerHeight + 10}px auto 0` }}>
			<AppContext.Provider value={contextValues}>
				<Routes>
					<Route path="/filter" element={<FilterIndex tittel="Søk på oppgaver" visningV2 />} />
					<Route path="/" element={<SaksbehandlerIndex />} />
					<Route path="/avdelingsleder" element={<AvdelingslederIndex />} />
					<Route path="/admin" element={<AdminIndex />} />
					<Route path={aktoerPath} element={<AktoerIndex />} />
					<Route element={<MissingPage />} />
				</Routes>
			</AppContext.Provider>
		</div>
	);
};

export default Home;
