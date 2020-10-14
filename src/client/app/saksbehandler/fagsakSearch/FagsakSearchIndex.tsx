import React, { FunctionComponent, useState } from 'react';
import OppgaveErReservertAvAnnenModal from 'saksbehandler/components/OppgaveErReservertAvAnnenModal';
import { getK9sakHref } from 'app/paths';

import { OppgaveStatus } from 'saksbehandler/oppgaveStatusTsType';
import Oppgave from 'saksbehandler/oppgaveTsType';
import { SokeResultat } from 'saksbehandler/fagsakSearch/sokeResultatTsType';
import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import useGlobalStateRestApiData from 'api/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import NavAnsatt from 'app/navAnsattTsType';
import { errorOfType, ErrorTypes, getErrorResponseData } from 'api/rest-api';
import FagsakSearch from './components/FagsakSearch';

interface OwnProps {
  k9sakUrl: string;
}

/** s
 * FagsakSearchIndex
 *
 * Container komponent. Har ansvar for å vise søkeskjermbildet og å håndtere fagsaksøket
 * mot server og lagringen av resultatet i klientens state.
 */
const FagsakSearchIndex: FunctionComponent<OwnProps> = ({
  k9sakUrl,
}) => {
  const [reservertAvAnnenSaksbehandler, setReservertAvAnnenSaksbehandler] = useState(false);
  const [reservertOppgave, setReservertOppgave] = useState<Oppgave>();
  const [sokStartet, setSokStartet] = useState(false);
  const [sokFerdig, setSokFerdig] = useState(false);
  const [skalReservere, setSkalReservere] = useState(false);
  const { kanReservere } = useGlobalStateRestApiData<NavAnsatt>(RestApiGlobalStatePathsKeys.NAV_ANSATT);

  const goToFagsak = (saksnummer, behandlingId) => {
    window.location.assign(getK9sakHref(k9sakUrl, saksnummer, behandlingId));
  };

  const {
    startRequest: sokFagsak, resetRequestData: resetFagsakSok, data: fagsakerResultat = [], error: fagsakError,
  } = useRestApiRunner<SokeResultat>(K9LosApiKeys.SEARCH_FAGSAK);

  const searchResultAccessDenied = fagsakError && errorOfType(fagsakError, ErrorTypes.MANGLER_TILGANG_FEIL) ? getErrorResponseData(fagsakError) : undefined;

  const { startRequest: reserverOppgave } = useRestApiRunner<OppgaveStatus>(K9LosApiKeys.RESERVER_OPPGAVE);
  const { startRequest: leggTilBehandletOppgave } = useRestApiRunner(K9LosApiKeys.LEGG_TIL_BEHANDLET_OPPGAVE);
  const { startRequest: hentOppgaverForFagsaker, data: fagsakOppgaver } = useRestApiRunner<Oppgave[]>(K9LosApiKeys.OPPGAVER_FOR_FAGSAKER);

  const goToFagsakEllerApneModal = (oppgave: Oppgave) => {
    if (!oppgave.status.erReservert || (oppgave.status.erReservert && oppgave.status.erReservertAvInnloggetBruker)) {
      goToFagsak(oppgave.saksnummer, oppgave.behandlingId);
    } else if (oppgave.status.erReservert && !oppgave.status.erReservertAvInnloggetBruker) {
      setReservertAvAnnenSaksbehandler(true);
      setReservertOppgave(oppgave);
    }
  };

  const velgFagsakOperasjoner = (oppgave: Oppgave, reserver: boolean) => {
    if (oppgave.status.erReservert && !oppgave.status.erReservertAvInnloggetBruker) {
      setReservertOppgave(oppgave);
      setReservertAvAnnenSaksbehandler(true);
    }

    if (reserver && !kanReservere) {
      leggTilBehandletOppgave(oppgave);
      goToFagsak(oppgave.saksnummer, oppgave.behandlingId);
    }
    if (!reserver) {
      leggTilBehandletOppgave(oppgave);
      goToFagsakEllerApneModal(oppgave);
    } else if (reserver && kanReservere) {
      reserverOppgave({ id: oppgave.eksternId }).then(() => {
        leggTilBehandletOppgave(oppgave);
        goToFagsak(oppgave.saksnummer, oppgave.behandlingId);
      });
    } else if (!kanReservere) {
      leggTilBehandletOppgave(oppgave);
      goToFagsak(oppgave.saksnummer, oppgave.behandlingId);
    }
  };

  const sokFagsakFn = (values: {searchString: string; skalReservere: boolean}) => {
    setSkalReservere(values.skalReservere);
    setSokStartet(true);
    setSokFerdig(false);

    return sokFagsak(values).then((resultat) => {
      if (resultat.fagsaker.length > 0) {
        hentOppgaverForFagsaker({ saksnummerListe: resultat.fagsaker.map((fagsak) => `${fagsak.saksnummer}`).join(',') }).then(() => {
          setSokStartet(false);
          setSokFerdig(true);
        });
      } else {
        setSokStartet(false);
        setSokFerdig(true);
      }
    });
  };

  const lukkErReservertModalOgApneOppgave = (oppgave: Oppgave) => {
    setReservertOppgave(undefined);
    setReservertAvAnnenSaksbehandler(false);
    leggTilBehandletOppgave(oppgave);
    goToFagsak(oppgave.saksnummer, oppgave.behandlingId);
  };

  const resetSearchFn = () => {
    resetFagsakSok();
    setSokStartet(false);
    setSokFerdig(false);
  };

  return (
    <>
      <FagsakSearch
        fagsaker={fagsakerResultat}
        fagsakOppgaver={fagsakOppgaver || []}
        searchFagsakCallback={sokFagsakFn}
        searchResultReceived={sokFerdig}
        selectOppgaveCallback={velgFagsakOperasjoner}
        searchStarted={sokStartet}
        searchResultAccessDenied={searchResultAccessDenied}
        resetSearch={resetSearchFn}
      />
      {reservertAvAnnenSaksbehandler && reservertOppgave && (
        <OppgaveErReservertAvAnnenModal
          lukkErReservertModalOgOpneOppgave={lukkErReservertModalOgApneOppgave}
          oppgave={reservertOppgave}
          oppgaveStatus={reservertOppgave.status}
        />
      )}
    </>
  );
};

export default FagsakSearchIndex;
