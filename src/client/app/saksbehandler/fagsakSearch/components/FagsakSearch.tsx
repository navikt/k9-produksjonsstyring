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
  fagsaker: SokeResultat;
  fagsakOppgaver: Oppgave[];
  searchFagsakCallback: ({ searchString: string, skalReservere: boolean }) => void;
  searchResultReceived: boolean;
  selectOppgaveCallback: (oppgave: Oppgave, reserver: boolean) => void;
  searchStarted: boolean;
  searchResultAccessDenied?: {
    feilmelding?: string;
  };
  resetSearch: () => void;
}

const skalViseListe = (fagsaker, fagsakOppgaver) => {
  if (!fagsaker && !fagsakOppgaver) {
    return false;
  }
  return fagsaker.length >= 1 || (fagsaker.length >= 1 && fagsakOppgaver.filter((oppgave) => oppgave.saksnummer === fagsaker[0].saksnummer).length > 1);
};

/**
 * FagsakSearch
 *
 * Presentasjonskomponent. Denne setter sammen de ulike komponentene i søkebildet.
 * Er søkeresultat mottatt vises enten trefflisten og relatert person, eller en tekst som viser ingen resultater.
 */
const FagsakSearch: FunctionComponent<OwnProps> = ({
  fagsaker,
  fagsakOppgaver,
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
    {searchResultReceived && fagsaker && fagsaker.fagsaker.length === 0 && fagsaker.ikkeTilgang === false
      && <Normaltekst className={styles.label}><FormattedMessage id="FagsakSearch.ZeroSearchResults" /></Normaltekst>}
    {searchResultReceived && fagsaker && fagsaker.fagsaker.length === 0 && fagsaker.ikkeTilgang === true
    && <Normaltekst className={styles.label}><FormattedMessage id="FagsakSearch.IkkeTilgang" /></Normaltekst>}
    {searchResultReceived && skalViseListe(fagsaker.fagsaker, fagsakOppgaver) && (
      <>
        <PersonInfo person={fagsaker.fagsaker[0].person} />
        <VerticalSpacer sixteenPx />
        <Normaltekst>
          <FormattedMessage id="FagsakSearch.FlereApneBehandlinger" />
        </Normaltekst>
        <FagsakList selectOppgaveCallback={selectOppgaveCallback} />
      </>
    )}
  </div>
);

FagsakSearch.defaultProps = {
  searchResultAccessDenied: undefined,
};

export default FagsakSearch;
