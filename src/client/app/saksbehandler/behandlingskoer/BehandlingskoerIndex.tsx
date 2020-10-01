import React, {
  FunctionComponent, useCallback, useEffect, useState,
} from 'react';
import { K9LosApiKeys } from 'api/k9LosApi';
import { getK9sakHref, getK9tilbakeHref } from 'app/paths';
import { Oppgaveko } from 'saksbehandler/behandlingskoer/oppgavekoTsType';
import { OppgaveStatus } from 'saksbehandler/oppgaveStatusTsType';
import Oppgave from 'saksbehandler/oppgaveTsType';
import OppgaveErReservertAvAnnenModal from 'saksbehandler/components/OppgaveErReservertAvAnnenModal';
import useRestApiRunner from 'api/rest-api-hooks/local-data/useRestApiRunner';
import OppgavekoPanel from './components/OppgavekoPanel';

interface OwnProps {
  k9sakUrl: string;
  k9tilbakeUrl: string;
  sseUrl: string;
  oppgavekoer: Oppgaveko[];
  valgtOppgavekoId: string;
  setValgtOppgavekoId: (id: string) => void;
}

/**
 * BehandlingskoerIndex
 */
const BehandlingskoerIndex: FunctionComponent<OwnProps> = ({
  k9sakUrl,
  k9tilbakeUrl,
  setValgtOppgavekoId,
  valgtOppgavekoId,
}) => {
  const [id, setId] = useState(undefined);
  const [reservertOppgave, setReservertOppgave] = useState<Oppgave>();
  const [reservertAvAnnenSaksbehandler, setReservertAvAnnenSaksbehandler] = useState<boolean>(false);
  const [reservertOppgaveStatus, setReservertOppgaveStatus] = useState<OppgaveStatus>();

  const { startRequest: hentSaksbehandlersOppgavekoer, data: oppgavekoer = [] } = useRestApiRunner<Oppgaveko[]>(K9LosApiKeys.OPPGAVEKO);
  const { startRequest: hentReserverteOppgaver, data: reserverteOppgaver = [] } = useRestApiRunner<Oppgave[]>(K9LosApiKeys.RESERVERTE_OPPGAVER);
  const { startRequest: leggTilBehandletOppgave } = useRestApiRunner(K9LosApiKeys.LEGG_TIL_BEHANDLET_OPPGAVE);

  const { startRequest: reserverOppgave } = useRestApiRunner<OppgaveStatus>(K9LosApiKeys.RESERVER_OPPGAVE);

  const openFagsak = (oppgave: Oppgave) => {
    leggTilBehandletOppgave(oppgave);
    window.location.assign(getK9sakHref(k9sakUrl, oppgave.saksnummer, oppgave.behandlingId));
  };

  const openTilbakesak = (oppgave: Oppgave) => {
    window.location.assign(getK9tilbakeHref(k9tilbakeUrl, oppgave.saksnummer, oppgave.eksternId));
  };

  const openSak = (oppgave: Oppgave) => {
    if (oppgave.system === 'K9SAK') openFagsak(oppgave);
    else if (oppgave.system === 'K9TILBAKE') openTilbakesak(oppgave);
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
  }, [k9sakUrl, k9tilbakeUrl]);

  const lukkErReservertModalOgOpneOppgave = useCallback((oppgave: Oppgave) => {
    setReservertAvAnnenSaksbehandler(false);
    setReservertOppgave(undefined);
    setReservertOppgaveStatus(undefined);
    openSak(oppgave);
  }, [k9sakUrl, k9tilbakeUrl]);

  return (
    <>
      <OppgavekoPanel
        valgtOppgavekoId={valgtOppgavekoId}
        setValgtOppgavekoId={setValgtOppgavekoId}
        reserverOppgave={reserverOppgaveOgApne}
        oppgavekoer={oppgavekoer}
        valgtKoSkjermet={oppgavekoer.find((ko) => ko.id === valgtOppgavekoId).skjermet}
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
