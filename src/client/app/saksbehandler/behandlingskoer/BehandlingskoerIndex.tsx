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
import advarselImageUrl from '../../../images/advarsel.svg';
import OppgaveStatusBeskjed from '../../types/OppgaveStatusBeskjed';

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
  const [reservertAvAnnenSaksbehandler, setReservertAvAnnenSaksbehandler] = useState<boolean>(false);

  const [visModalForOppgavePåVent, setVisModalForOppgavePåVent] = useState<boolean>(false);
  const [visModalForSaksbehandlerHarBesluttetOppgaven, setVisModalForSaksbehandlerHarBesluttetOppgaven] = useState<boolean>(false);
  const [valgtOppgave, setValgtOppgave] = useState<Oppgave>();
  const [visModalForFlyttReservasjon, setVisModalForFlyttReservasjon] = useState<boolean>(false);
  const [valgtOppgaveStatus, setValgtOppgaveStatus] = useState<OppgaveStatus>();

  const refreshUrl = useGlobalStateRestApiData<{ verdi?: string }>(RestApiGlobalStatePathsKeys.REFRESH_URL);
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
    setValgtOppgave(null);
    setValgtOppgaveStatus(null);
    setVisModalForOppgavePåVent(false);
    setVisModalForFlyttReservasjon(false);
  };

  const reserverOppgaveOgApne = useCallback((oppgave: Oppgave) => {
    if (oppgave.status.erReservert) {
      openSak(oppgave);
    } else if (!!oppgave.paaVent && oppgave.paaVent) {
      setVisModalForOppgavePåVent(true);
      setValgtOppgave(oppgave);
    } else {
      reserverOppgave({ oppgaveId: oppgave.eksternId }).then((nyOppgaveStatus) => {
        if (nyOppgaveStatus.erReservert && nyOppgaveStatus.erReservertAvInnloggetBruker) {
          openSak(oppgave);
        } else if (!!nyOppgaveStatus.beskjed && nyOppgaveStatus.beskjed === OppgaveStatusBeskjed.BESLUTTET_AV_DEG) {
          setVisModalForSaksbehandlerHarBesluttetOppgaven(true);
          setValgtOppgave(oppgave);
        } else if (nyOppgaveStatus.kanOverstyres) {
          setValgtOppgave(oppgave);
          setValgtOppgaveStatus(nyOppgaveStatus);
          setVisModalForFlyttReservasjon(true);
        } else if (nyOppgaveStatus.erReservert && !nyOppgaveStatus.erReservertAvInnloggetBruker) {
          setReservertAvAnnenSaksbehandler(true);
          setValgtOppgave(oppgave);
          setValgtOppgaveStatus(nyOppgaveStatus);
        }
      }).then(() => hentReserverteOppgaver());
    }
  }, [k9sakUrl]);

  const lukkErReservertModalOgOpneOppgave = useCallback((oppgave: Oppgave) => {
    setReservertAvAnnenSaksbehandler(false);
    setValgtOppgave(null);
    setValgtOppgaveStatus(undefined);
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
      {reservertAvAnnenSaksbehandler && valgtOppgave && valgtOppgaveStatus && (
      <OppgaveErReservertAvAnnenModal
        lukkErReservertModalOgOpneOppgave={lukkErReservertModalOgOpneOppgave}
        oppgave={valgtOppgave}
        oppgaveStatus={valgtOppgaveStatus}
        lukkModal={lukkModal}
      />
      )}
      {visModalForOppgavePåVent && (
        <ModalMedIkon
          cancel={() => lukkModal()}
          submit={() => openSak(valgtOppgave)}
          tekst={{
            valgmulighetA: 'Åpne',
            valgmulighetB: 'Tilbake',
            formattedMessageId: 'OppgavePåVentModal.OppgavePåVent',
            values: { dato: valgtOppgave.behandlingsfrist.substring(0, 10).replaceAll('-', '.') },
          }}
          ikonUrl={timeglassUrl}
          ikonAlt="Timeglass"
        />
      )}

      {visModalForSaksbehandlerHarBesluttetOppgaven && (
        <ModalMedIkon
          cancel={() => { setVisModalForSaksbehandlerHarBesluttetOppgaven(false); setValgtOppgave(null); }}
          tekst={{
            valgmulighetB: intl.formatMessage({ id: 'OppgaveErReservertAvAnnenModal.GåTilKøen' }),
            formattedMessageId: 'visModalForSaksbehandlerHarBesluttetOppgaven.Informasjon',
          }}
          ikonUrl={advarselImageUrl}
          ikonAlt="advarselTriangel"
        />
      )}

      {visModalForFlyttReservasjon && valgtOppgave && (
        <FlyttReservasjonsmodal
          intl={intl}
          oppgave={valgtOppgave}
          oppgaveStatus={valgtOppgaveStatus}
          lukkFlyttReservasjonsmodal={() => lukkModal()}
          openSak={openSak}
          hentReserverteOppgaver={hentReserverteOppgaver}
        />
      )}
    </>
  );
};

export default injectIntl(BehandlingskoerIndex);
