import React, { FunctionComponent, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import queryString from 'query-string';
import Oppgave from 'saksbehandler/oppgaveTsType';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { hasValidSaksnummerEllerJournalpostFormat } from 'utils/validation/validators';
import FagsakList from './FagsakList';
import SearchForm from './SearchForm';
import * as styles from './fagsakSearch.css';
import PersonInfo from './person/PersonInfo';
import { useSøk } from 'api/queries/saksbehandlerQueries';

interface OwnProps {
	setOppgave: (oppgave: Oppgave) => void;
	goToFagsak: (oppgave: Oppgave) => void;
}

const skalViseListe = (resultat) => {
	if (!resultat && !resultat.oppgaver) {
		return false;
	}
	return resultat.oppgaver.length >= 1;
};

/**
 * FagsakSearch
 *
 * Presentasjonskomponent. Denne setter sammen de ulike komponentene i søkebildet.
 * Er søkeresultat mottatt vises enten trefflisten og relatert person, eller en tekst som viser ingen resultater.
 */
const FagsakSearch: FunctionComponent<OwnProps> = ({ setOppgave, goToFagsak }) => {
	const queryFraURL = queryString.parse(window.location?.search ? location.search : '');
	const erSokViaQueryParams = queryFraURL.sok && !hasValidSaksnummerEllerJournalpostFormat(queryFraURL.sok);
	const { data: resultat, mutate: sok, error, isSuccess, isLoading } = useSøk();
	useEffect(() => {
		if (erSokViaQueryParams) {
			const paramToString = queryFraURL.sok.toString();
			sok(paramToString);
		}
	}, []);

	return (
		<div>
			<SearchForm onSubmit={sok} searchStarted={isLoading} />
			{isSuccess && resultat && resultat.oppgaver.length === 0 && !resultat.ikkeTilgang && (
				<Normaltekst className={styles.label}>
					<FormattedMessage id="FagsakSearch.ZeroSearchResults" />
				</Normaltekst>
			)}
			{isSuccess && resultat && resultat.oppgaver.length === 0 && resultat.ikkeTilgang && (
				<Normaltekst className={styles.label}>
					<FormattedMessage id="FagsakSearch.IkkeTilgang" />
				</Normaltekst>
			)}
			{isSuccess && skalViseListe(resultat) && (
				<>
					{resultat.person && <PersonInfo person={resultat.person} />}
					<VerticalSpacer sixteenPx />
					<Normaltekst>
						<FormattedMessage id="FagsakSearch.FlereApneBehandlinger" />
					</Normaltekst>
					<FagsakList fagsakOppgaver={resultat.oppgaver} setOppgave={setOppgave} goToFagsak={goToFagsak} />
				</>
			)}
		</div>
	);
};

export default FagsakSearch;
