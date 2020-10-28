import React, {
  FunctionComponent, useCallback, useEffect, useState,
} from 'react';
import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import { getK9punsjRef, getK9sakHref } from 'app/paths';
import { Oppgaveko } from 'saksbehandler/behandlingskoer/oppgavekoTsType';
import { OppgaveStatus } from 'saksbehandler/oppgaveStatusTsType';
import Oppgave from 'saksbehandler/oppgaveTsType';
import OppgaveErReservertAvAnnenModal from 'saksbehandler/components/OppgaveErReservertAvAnnenModal';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { useRestApi } from 'api/rest-api-hooks';
import useGlobalStateRestApiData from 'api/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import RestApiState from 'api/rest-api-hooks/src/RestApiState';
import behandlingType from 'kodeverk/behandlingType';
import OppgavekoPanel from './components/OppgavekoPanel';

interface OwnProps {
  k9sakUrl: string;
  k9punsjUrl: string;
  valgtOppgavekoId?: string;
  setValgtOppgavekoId: (id: string) => void;
}

/**
 * BehandlingskoerIndex
 */
const BehandlingskoerIndex: FunctionComponent<OwnProps> = ({
  k9sakUrl,
  k9punsjUrl,
  setValgtOppgavekoId,
  valgtOppgavekoId,
}) => {
  const sseUrl = useGlobalStateRestApiData<{ verdi?: string }>(RestApiGlobalStatePathsKeys.SSE_URL);
  const [reservertOppgave, setReservertOppgave] = useState<Oppgave>();
  const [reservertAvAnnenSaksbehandler, setReservertAvAnnenSaksbehandler] = useState<boolean>(false);
  const [reservertOppgaveStatus, setReservertOppgaveStatus] = useState<OppgaveStatus>();

  const { data: oppgavekoer = [] } = useRestApi<Oppgaveko[]>(K9LosApiKeys.OPPGAVEKO);
  const {
    startRequest: hentOppgaverTilBehandling, state, data: oppgaverTilBehandling = [],
  } = useRestApiRunner<Oppgave[]>(K9LosApiKeys.OPPGAVER_TIL_BEHANDLING);
  const { startRequest: hentReserverteOppgaver, data: reserverteOppgaver = [] } = useRestApiRunner<Oppgave[]>(K9LosApiKeys.RESERVERTE_OPPGAVER);
  const { startRequest: leggTilBehandletOppgave } = useRestApiRunner(K9LosApiKeys.LEGG_TIL_BEHANDLET_OPPGAVE);

  const { startRequest: reserverOppgave } = useRestApiRunner<OppgaveStatus>(K9LosApiKeys.RESERVER_OPPGAVE);

  const handleEvent = (e: MessageEvent) => {
    const data = JSON.parse(e.data);
    if (data.melding === 'oppdaterReserverte') {
      hentReserverteOppgaver();
    } else if (data.melding === 'oppdaterTilBehandling') {
      if (valgtOppgavekoId === data.id) {
        hentOppgaverTilBehandling({ id: valgtOppgavekoId });
      }
    }
  };

  useEffect(() => {
    const source = new EventSource(sseUrl.verdi, { withCredentials: true });
    source.addEventListener('message', (message) => {
      handleEvent(message);
    });
    if (valgtOppgavekoId !== undefined) { hentOppgaverTilBehandling({ id: valgtOppgavekoId }); }
    hentReserverteOppgaver();
  }, [valgtOppgavekoId]);

  const openFagsak = (oppgave: Oppgave) => {
    leggTilBehandletOppgave(oppgave);
    if (oppgave.behandlingstype === behandlingType.PUNSJ && oppgave.journalpostId !== null) {
      window.location.assign(getK9punsjRef(k9punsjUrl, oppgave.journalpostId));
    } else {
      window.location.assign(getK9sakHref(k9sakUrl, oppgave.saksnummer, oppgave.behandlingId));
    }
  };

  const openSak = (oppgave: Oppgave) => {
    if (oppgave.system === 'K9SAK') openFagsak(oppgave);
    else throw new Error('Fagsystemet for oppgaven er ukjent');
  };

  const reserverOppgaveOgApne = useCallback((oppgave: Oppgave) => {
    if (oppgave.status.erReservert) {
      openSak(oppgave);
    } else {
      reserverOppgave({ oppgaveId: oppgave.eksternId }).then((nyOppgaveStatus) => {
        if (nyOppgaveStatus.erReservert && nyOppgaveStatus.erReservertAvInnloggetBruker) {
          openSak(oppgave);
        } else if (nyOppgaveStatus.erReservert && !nyOppgaveStatus.erReservertAvInnloggetBruker) {
          setReservertAvAnnenSaksbehandler(true);
          setReservertOppgave(oppgave);
          setReservertOppgaveStatus(nyOppgaveStatus);
        }
      }).then(() => hentReserverteOppgaver());
    }
  }, [k9sakUrl]);

  const lukkErReservertModalOgOpneOppgave = useCallback((oppgave: Oppgave) => {
    setReservertAvAnnenSaksbehandler(false);
    setReservertOppgave(undefined);
    setReservertOppgaveStatus(undefined);
    openSak(oppgave);
  }, [k9sakUrl]);

  if (oppgavekoer.length === 0) {
    return null;
  }

  return (
    <>
      <OppgavekoPanel
        valgtOppgavekoId={valgtOppgavekoId}
        setValgtOppgavekoId={setValgtOppgavekoId}
        reserverOppgave={reserverOppgaveOgApne}
        oppgavekoer={oppgavekoer}
        requestFinished={state === RestApiState.SUCCESS}
        oppgaverTilBehandling={oppgaverTilBehandling}
        reserverteOppgaver={reserverteOppgaver}
        hentReserverteOppgaver={hentReserverteOppgaver}
      />
      {reservertAvAnnenSaksbehandler && reservertOppgave && reservertOppgaveStatus && (
      <OppgaveErReservertAvAnnenModal
        lukkErReservertModalOgOpneOppgave={lukkErReservertModalOgOpneOppgave}
        oppgave={reservertOppgave}
        oppgaveStatus={reservertOppgaveStatus}
      />
      )}
    </>
  );
};

export default BehandlingskoerIndex;
