import React, { FunctionComponent, useState } from 'react';
import OppgaveErReservertAvAnnenModal from 'saksbehandler/components/OppgaveErReservertAvAnnenModal';
import { getK9punsjRef, getK9sakHref, getOmsorgspengerRef } from 'app/paths';

import { OppgaveStatus } from 'saksbehandler/oppgaveStatusTsType';
import Oppgave from 'saksbehandler/oppgaveTsType';
import { SokeResultat } from 'saksbehandler/fagsakSearch/sokeResultatTsType';
import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import useGlobalStateRestApiData from 'api/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import NavAnsatt from 'app/navAnsattTsType';
import { errorOfType, ErrorTypes, getErrorResponseData } from 'api/rest-api';
import { FlyttReservasjonsmodal } from 'saksbehandler/components/FlyttReservasjonModal/FlyttReservasjonModal';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import FagsakSearch from './components/FagsakSearch';
import OppgaveSystem from '../../types/OppgaveSystem';

interface OwnProps {
  k9sakUrl: string;
  k9punsjUrl: string;
  omsorgspengerUrl: string;
}

/**
 * FagsakSearchIndex
 *
 * Container komponent. Har ansvar for å vise søkeskjermbildet og å håndtere fagsaksøket
 * mot server og lagringen av resultatet i klientens state.
 */

const FagsakSearchIndex: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  k9sakUrl,
  k9punsjUrl,
  omsorgspengerUrl,
}) => {
  const [reservertAvAnnenSaksbehandler, setReservertAvAnnenSaksbehandler] = useState(false);
  const [visModalForFlyttReservasjon, setVisModalForFlyttReservasjon] = useState<boolean>(false);
  const [valgtOppgave, setValgtOppgave] = useState<Oppgave>();
  const [valgtOppgaveStatus, setValgtOppgaveStatus] = useState<OppgaveStatus>();

  const [reservertOppgave, setReservertOppgave] = useState<Oppgave>();
  const [sokStartet, setSokStartet] = useState(false);
  const [sokFerdig, setSokFerdig] = useState(false);
  const { kanReservere } = useGlobalStateRestApiData<NavAnsatt>(RestApiGlobalStatePathsKeys.NAV_ANSATT);

  const goToFagsak = (oppgave: Oppgave) => {
    switch (oppgave.system) {
      case OppgaveSystem.K9SAK:
        window.location.assign(getK9sakHref(k9sakUrl, oppgave.saksnummer, oppgave.behandlingId));
        break;
      case OppgaveSystem.K9TILBAKE:
        window.location.assign(getK9sakHref(k9sakUrl, oppgave.saksnummer, oppgave.behandlingId));
        break;
      case OppgaveSystem.PUNSJ:
        window.location.assign(getK9punsjRef(k9punsjUrl, oppgave.journalpostId));
        break;
      case OppgaveSystem.OMSORGSPENGER:
        window.location.assign(getOmsorgspengerRef(omsorgspengerUrl, oppgave.saksnummer));
        break;
      default:
        window.location.assign(getK9sakHref(k9sakUrl, oppgave.saksnummer, oppgave.behandlingId));
    }
  };

  const {
    startRequest: sokFagsak,
    resetRequestData: resetFagsakSok,
    data: fagsakerResultat = [],
    error: fagsakError,
  } = useRestApiRunner<SokeResultat>(K9LosApiKeys.SEARCH_FAGSAK);

  const searchResultAccessDenied =
    fagsakError && errorOfType(fagsakError, ErrorTypes.MANGLER_TILGANG_FEIL)
      ? getErrorResponseData(fagsakError)
      : undefined;

  const { startRequest: reserverOppgave } = useRestApiRunner<OppgaveStatus>(K9LosApiKeys.RESERVER_OPPGAVE);
  const { startRequest: leggTilBehandletOppgave } = useRestApiRunner(K9LosApiKeys.LEGG_TIL_BEHANDLET_OPPGAVE);

  const goToFagsakEllerApneModal = (oppgave: Oppgave) => {
    if (!oppgave.status.erReservert || (oppgave.status.erReservert && oppgave.status.erReservertAvInnloggetBruker)) {
      goToFagsak(oppgave);
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
      goToFagsak(oppgave);
    }
    if (!reserver) {
      leggTilBehandletOppgave(oppgave);
      goToFagsakEllerApneModal(oppgave);
    } else if (reserver && kanReservere) {
      reserverOppgave({ oppgaveId: oppgave.eksternId }).then(nyOppgaveStatus => {
        if (nyOppgaveStatus.kanOverstyres) {
          setValgtOppgave(oppgave);
          setValgtOppgaveStatus(nyOppgaveStatus);
          setVisModalForFlyttReservasjon(true);
        } else {
          leggTilBehandletOppgave(oppgave);
          goToFagsak(oppgave);
        }
      });
    } else if (!kanReservere) {
      leggTilBehandletOppgave(oppgave);
      goToFagsak(oppgave);
    }
  };

  const sokFagsakFn = (values: { searchString: string; skalReservere: boolean }) => {
    setSokStartet(true);
    setSokFerdig(false);

    return sokFagsak(values).then(resultat => {
      setSokStartet(false);
      setSokFerdig(true);
    });
  };

  const lukkErReservertModalOgApneOppgave = (oppgave: Oppgave) => {
    setReservertOppgave(undefined);
    setReservertAvAnnenSaksbehandler(false);
    leggTilBehandletOppgave(oppgave);
    goToFagsak(oppgave);
  };

  const lukkModal = () => {
    setReservertOppgave(undefined);
    setReservertAvAnnenSaksbehandler(false);
  };

  const resetSearchFn = () => {
    resetFagsakSok();
    setSokStartet(false);
    setSokFerdig(false);
  };

  return (
    <>
      <FagsakSearch
        resultat={fagsakerResultat}
        searchFagsakCallback={sokFagsakFn}
        searchResultReceived={sokFerdig}
        selectOppgaveCallback={velgFagsakOperasjoner}
        searchStarted={sokStartet}
        searchResultAccessDenied={searchResultAccessDenied}
        resetSearch={resetSearchFn}
        goToFagsak={goToFagsak}
      />
      {reservertAvAnnenSaksbehandler && reservertOppgave && (
        <OppgaveErReservertAvAnnenModal
          lukkModal={lukkModal}
          lukkErReservertModalOgOpneOppgave={lukkErReservertModalOgApneOppgave}
          oppgave={reservertOppgave}
          oppgaveStatus={reservertOppgave.status}
        />
      )}

      {visModalForFlyttReservasjon && valgtOppgave && valgtOppgaveStatus && (
        <FlyttReservasjonsmodal
          intl={intl}
          oppgave={valgtOppgave}
          oppgaveStatus={valgtOppgaveStatus}
          lukkFlyttReservasjonsmodal={() => {
            setVisModalForFlyttReservasjon(false);
            setValgtOppgave(null);
          }}
          openSak={goToFagsak}
        />
      )}
    </>
  );
};

export default injectIntl(FagsakSearchIndex);
