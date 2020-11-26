import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import Oppgave from 'saksbehandler/oppgaveTsType';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { SokeResultat } from 'saksbehandler/fagsakSearch/sokeResultatTsType';
import PersonInfo from './person/PersonInfo';
import SearchForm from './SearchForm';
import FagsakList from './FagsakList';

import styles from './fagsakSearch.less';

interface OwnProps {
  resultat: SokeResultat;
  searchFagsakCallback: ({ searchString: string, skalReservere: boolean }) => void;
  searchResultReceived: boolean;
  selectOppgaveCallback: (oppgave: Oppgave, reserver: boolean) => void;
  searchStarted: boolean;
  searchResultAccessDenied?: {
    feilmelding?: string;
  };
  resetSearch: () => void;
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
const FagsakSearch: FunctionComponent<OwnProps> = ({
  resultat,
  searchFagsakCallback,
  selectOppgaveCallback,
  searchResultReceived,
  searchStarted,
  searchResultAccessDenied,
  resetSearch,
}) => (
  <div>
    <SearchForm
      onSubmit={searchFagsakCallback}
      searchStarted={searchStarted}
      searchResultAccessDenied={searchResultAccessDenied}
      resetSearch={resetSearch}
    />
    {searchResultReceived && resultat && resultat.oppgaver.length === 0 && resultat.ikkeTilgang === false
      && <Normaltekst className={styles.label}><FormattedMessage id="FagsakSearch.ZeroSearchResults" /></Normaltekst>}
    {searchResultReceived && resultat && resultat.oppgaver.length === 0 && resultat.ikkeTilgang === true
    && <Normaltekst className={styles.label}><FormattedMessage id="FagsakSearch.IkkeTilgang" /></Normaltekst>}
    {searchResultReceived && skalViseListe(resultat) && (
      <>
        <PersonInfo person={resultat.person} />
        <VerticalSpacer sixteenPx />
        <Normaltekst>
          <FormattedMessage id="FagsakSearch.FlereApneBehandlinger" />
        </Normaltekst>
        <FagsakList fagsakOppgaver={resultat.oppgaver} selectOppgaveCallback={selectOppgaveCallback} />
      </>
    )}
  </div>
);

FagsakSearch.defaultProps = {
  searchResultAccessDenied: undefined,
};

export default FagsakSearch;
