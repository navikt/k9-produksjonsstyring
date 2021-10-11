import React, {
  FunctionComponent, useCallback, useEffect, useState,
} from 'react';
import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import { getK9punsjRef, getK9sakHref, getOmsorgspengerRef } from 'app/paths';
import { Oppgaveko } from 'saksbehandler/behandlingskoer/oppgavekoTsType';
import { OppgaveStatus } from 'saksbehandler/oppgaveStatusTsType';
import Oppgave from 'saksbehandler/oppgaveTsType';
import OppgaveErReservertAvAnnenModal from 'saksbehandler/components/OppgaveErReservertAvAnnenModal';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { useRestApi } from 'api/rest-api-hooks';
import useGlobalStateRestApiData from 'api/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import RestApiState from 'api/rest-api-hooks/src/RestApiState';
import ModalMedIkon from 'sharedComponents/modal/ModalMedIkon';
import { FlyttReservasjonsmodal } from 'saksbehandler/components/FlyttReservasjonModal/FlyttReservasjonModal';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import OppgavekoPanel from './components/OppgavekoPanel';
import timeglassUrl from '../../../images/timeglass.svg';
import OppgaveSystem from '../../types/OppgaveSystem';

interface OwnProps {
  k9sakUrl: string;
  k9punsjUrl: string;
  omsorgspengerUrl: string;
  valgtOppgavekoId?: string;
  setValgtOppgavekoId: (id: string) => void;
}

/**
 * BehandlingskoerIndex
 */
const BehandlingskoerIndex: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  k9sakUrl,
  k9punsjUrl,
  setValgtOppgavekoId,
  valgtOppgavekoId,
  omsorgspengerUrl,
}) => {
  const refreshUrl = useGlobalStateRestApiData<{ verdi?: string }>(RestApiGlobalStatePathsKeys.REFRESH_URL);
  const [reservertOppgave, setReservertOppgave] = useState<Oppgave>();
  const [reservertAvAnnenSaksbehandler, setReservertAvAnnenSaksbehandler] = useState<boolean>(false);
  const [reservertOppgaveStatus, setReservertOppgaveStatus] = useState<OppgaveStatus>();
  const [visModalForOppgavePåVent, setVisModalForOppgavePåVent] = useState<boolean>(false);
  const [visModalForFlyttReservasjon, setVisModalForFlyttReservasjon] = useState<boolean>(true);
  const [oppgavePåVent, setOppgavePåVent] = useState<Oppgave>();
  const [valgtOppgave, setValgtOppgave] = useState<Oppgave>();

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

  const socket = new WebSocket(refreshUrl.verdi);

  useEffect(() => {
    socket.onopen = () => {
      // on connecting, do nothing but log it to the console
      // eslint-disable-next-line no-console
      console.log('connected');
    };

    socket.onmessage = (evt) => {
      // listen to data sent from the websocket server
      handleEvent(evt);
    };

    socket.onclose = (ev) => {
      // eslint-disable-next-line no-console
      console.log(`disconnected, reason: ${ev.reason}`);
      // automatically try to reconnect on connection loss
    };

    socket.onerror = (err) => {
      // eslint-disable-next-line no-console
      console.error(
        'Socket encountered error: ',
        err,
        'Closing socket',
      );

      socket.close();
    };

    if (valgtOppgavekoId !== undefined) { hentOppgaverTilBehandling({ id: valgtOppgavekoId }); }
    hentReserverteOppgaver();
  }, [valgtOppgavekoId]);

  const openFagsak = (oppgave: Oppgave) => {
    leggTilBehandletOppgave(oppgave);
    switch (oppgave.system) {
      case OppgaveSystem.PUNSJ:
        window.location.assign(getK9punsjRef(k9punsjUrl, oppgave.journalpostId));
        break;
      case OppgaveSystem.K9SAK:
        window.location.assign(getK9sakHref(k9sakUrl, oppgave.saksnummer, oppgave.behandlingId));
        break;
      case OppgaveSystem.K9TILBAKE:
        window.location.assign(getK9sakHref(k9sakUrl, oppgave.saksnummer, oppgave.behandlingId));
        break;
      case OppgaveSystem.OMSORGSPENGER:
        window.location.assign(getOmsorgspengerRef(omsorgspengerUrl, oppgave.saksnummer));
        break;
      default: window.location.assign(getK9sakHref(k9sakUrl, oppgave.saksnummer, oppgave.behandlingId));
    }
  };

  const openSak = (oppgave: Oppgave) => {
    if (oppgave.system === OppgaveSystem.K9SAK
      || oppgave.system === OppgaveSystem.K9TILBAKE
      || oppgave.system === OppgaveSystem.PUNSJ
      || oppgave.system === OppgaveSystem.OMSORGSPENGER) {
      openFagsak(oppgave);
    } else throw new Error('Fagsystemet for oppgaven er ukjent');
  };

  const lukkModal = () => {
    setReservertAvAnnenSaksbehandler(false);
    setVisModalForOppgavePåVent(false);
    setVisModalForFlyttReservasjon(false);
    setReservertOppgave(null);
    setReservertOppgaveStatus(null);
    setOppgavePåVent(null);
    setValgtOppgave(null);
  };

  const reserverOppgaveOgApne = useCallback((oppgave: Oppgave) => {
    if (oppgave.status.erReservert) {
      openSak(oppgave);
    } else if (typeof oppgave.paaVent !== 'undefined' && oppgave.paaVent) {
      setVisModalForOppgavePåVent(true);
      setOppgavePåVent(oppgave);
    } else if (oppgave.status.kanOverstyres) {
      setValgtOppgave(oppgave);
      setVisModalForFlyttReservasjon(true);
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
        lukkModal={lukkModal}
      />
      )}
      {visModalForOppgavePåVent && (
        <ModalMedIkon
          cancel={() => lukkModal()}
          submit={() => openSak(oppgavePåVent)}
          tekst={{
            valgmulighetA: 'Åpne',
            valgmulighetB: 'Tilbake',
            formattedMessageId: 'OppgavePåVentModal.OppgavePåVent',
            values: { dato: oppgavePåVent.behandlingsfrist.substring(0, 10).replaceAll('-', '.') },
          }}
          ikonUrl={timeglassUrl}
          ikonAlt="Timeglass"
        />
      )}

      {visModalForFlyttReservasjon && (
      <FlyttReservasjonsmodal
        intl={intl}
        oppgave={valgtOppgave}
        lukkFlyttReservasjonsmodal={() => lukkModal()}
        openSak={openSak}
        hentReserverteOppgaver={hentReserverteOppgaver}
      />
      )}
    </>
  );
};

export default injectIntl(BehandlingskoerIndex);
