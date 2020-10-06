import React, {
  FunctionComponent, ReactNode, useCallback, useEffect, useRef, useState,
} from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import NavFrontendChevron from 'nav-frontend-chevron';

import { getDateAndTime } from 'utils/dateUtils';
import Image from 'sharedComponents/Image';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import Oppgave from 'saksbehandler/oppgaveTsType';
import { OppgaveStatus } from 'saksbehandler/oppgaveStatusTsType';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import DateLabel from 'sharedComponents/DateLabel';
import menuIconBlueUrl from 'images/ic-menu-18px_blue.svg';
import menuIconBlackUrl from 'images/ic-menu-18px_black.svg';
import bubbletextUrl from 'images/bubbletext.svg';
import bubbletextFilledUrl from 'images/bubbletext_filled.svg';

import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import NavFrontendSpinner from 'nav-frontend-spinner';

import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { Oppgaveko } from 'saksbehandler/behandlingskoer/oppgavekoTsType';
import useGlobalStateRestApiData from 'api/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import RestApiState from 'api/rest-api-hooks/src/RestApiState';
import Reservasjon from 'avdelingsleder/reservasjoner/reservasjonTsType';
import styles from './oppgaverTabell.less';
import OppgaveHandlingerMenu from './menu/OppgaveHandlingerMenu';

const headerTextCodes = [
  'OppgaverTabell.Soker',
  'OppgaverTabell.Behandlingstype',
  'OppgaverTabell.BehandlingOpprettet',
  'EMPTY_1',
  'EMPTY_2',
];

const EMPTY_ARRAY = [];

type OppgaveMedReservertIndikator = Oppgave & { underBehandling?: boolean };

const slaSammenOgMarkerReserverte = (reserverteOppgaver, oppgaverTilBehandling): OppgaveMedReservertIndikator[] => {
  const markedAsUnderBehandling = reserverteOppgaver
    .filter((reservertOppgave) => !oppgaverTilBehandling.some((oppgave) => oppgave.eksternId === reservertOppgave.eksternId))
    .map((f) => ({
      ...f,
      underBehandling: true,
    }));

  return markedAsUnderBehandling.concat(oppgaverTilBehandling);
};

const getToggleMenuEvent = (oppgave: OppgaveMedReservertIndikator, toggleMenu) => (oppgave.underBehandling ? () => toggleMenu(oppgave) : undefined);

interface OwnProps {
  valgtOppgavekoId: string;
  reserverOppgave: (oppgave: Oppgave) => void;
}

/**
 * OppgaverTabell
 */
export const OppgaverTabell: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  valgtOppgavekoId,
  reserverOppgave,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [valgtOppgaveId, setValgtOppgaveId] = useState<string>();
  const [offset, setOffset] = useState({
    left: 0,
    top: 0,
  });

  const sseUrl = useGlobalStateRestApiData<{ verdi?: string }>(RestApiGlobalStatePathsKeys.SSE_URL);
  const { startRequest: hentSaksbehandlersOppgavekoer, data: oppgavekoer = EMPTY_ARRAY } = useRestApiRunner<Oppgaveko[]>(K9LosApiKeys.OPPGAVEKO);
  const { startRequest: hentReserverteOppgaver, data: reserverteOppgaver = EMPTY_ARRAY } = useRestApiRunner<Oppgave[]>(K9LosApiKeys.RESERVERTE_OPPGAVER);
  const { startRequest: leggTilBehandletOppgave } = useRestApiRunner(K9LosApiKeys.LEGG_TIL_BEHANDLET_OPPGAVE);
  const { startRequest: forlengOppgavereservasjon } = useRestApiRunner<Reservasjon[]>(K9LosApiKeys.FORLENG_OPPGAVERESERVASJON);
  const { startRequest: hentAntallOppgaver, data: antallOppgaver } = useRestApiRunner<number>(K9LosApiKeys.BEHANDLINGSKO_OPPGAVE_ANTALL);
  const {
    startRequest: hentOppgaverTilBehandling, state, data: oppgaverTilBehandling = EMPTY_ARRAY, error: hentOppgaverTilBehandlingError,
  } = useRestApiRunner<Oppgave[] | string>(K9LosApiKeys.OPPGAVER_TIL_BEHANDLING);

  const forlengOppgaveReservasjonFn = useCallback((oppgaveId: string): Promise<any> => forlengOppgavereservasjon({ oppgaveId })
    .then(() => hentReserverteOppgaver({}, true)), []);

  const ref = useRef({});

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
    hentAntallOppgaver({ id: valgtOppgavekoId });
    const source = new EventSource(sseUrl.verdi, { withCredentials: true });
    source.addEventListener('message', (message) => {
      handleEvent(message);
    });
    hentSaksbehandlersOppgavekoer();
    if (valgtOppgavekoId) {
      hentOppgaverTilBehandling({ id: valgtOppgavekoId });
    }
  }, [valgtOppgavekoId]);

  const goToFagsak = useCallback((event: Event, id: number, oppgave: Oppgave) => {
    if (ref.current && Object.keys(ref.current).some((key) => ref.current[key] && ref.current[key].contains(event.target))) {
      return;
    }
    leggTilBehandletOppgave(oppgave);
    reserverOppgave(oppgave);
  }, [ref.current]);

  const toggleMenu = useCallback((valgtOppgave: Oppgave) => {
    const newOffset = ref.current[valgtOppgave.eksternId].getBoundingClientRect();
    setShowMenu(!showMenu);
    setValgtOppgaveId(valgtOppgave.eksternId);
    setOffset({ top: newOffset.top, left: newOffset.left });
  }, [ref.current, showMenu]);

  const createTooltip = useCallback((oppgaveStatus: OppgaveStatus): ReactNode | undefined => {
    const { flyttetReservasjon } = oppgaveStatus;
    if (!flyttetReservasjon) {
      return undefined;
    }
    const datoOgTid = getDateAndTime(flyttetReservasjon.tidspunkt);
    const textValues = {
      dato: datoOgTid.date,
      tid: datoOgTid.time,
      uid: flyttetReservasjon.uid,
      navn: flyttetReservasjon.navn,
      beskrivelse: flyttetReservasjon.begrunnelse,
      br: <br />,
    };
    return (
      <Normaltekst><FormattedMessage id="OppgaverTabell.OverfortReservasjonTooltip" values={textValues} /></Normaltekst>
    );
  }, []);

  const alleOppgaver = slaSammenOgMarkerReserverte(reserverteOppgaver, oppgaverTilBehandling);
  const valgtOppgave = reserverteOppgaver.find((o) => o.eksternId === valgtOppgaveId);

  return (
    <>
      <Element><FormattedMessage id="OppgaverTabell.DineNesteSaker" values={{ antall: antallOppgaver }} /></Element>
      {alleOppgaver.length === 0 && state === RestApiState.LOADING && (
        <NavFrontendSpinner type="XL" className={styles.spinner} />
      )}
      {alleOppgaver.length === 0 && state === RestApiState.SUCCESS && (
      <>
        <VerticalSpacer eightPx />
        <Normaltekst><FormattedMessage id="OppgaverTabell.IngenOppgaver" /></Normaltekst>
      </>
      )}

      {oppgaverTilBehandling.length === 0 && state === RestApiState.SUCCESS && (
        <>
          <VerticalSpacer eightPx />
          <Normaltekst><FormattedMessage id="OppgaverTabell.IngenTilgang" /></Normaltekst>
        </>
      )}
      {alleOppgaver.length > 0 && state === RestApiState.SUCCESS && (
      <>
        <Table headerTextCodes={headerTextCodes}>
          {alleOppgaver.map((oppgave) => (
            <TableRow
              key={oppgave.eksternId}
              onMouseDown={goToFagsak}
              onKeyDown={goToFagsak}
              className={oppgave.underBehandling ? styles.isUnderBehandling : undefined}
              model={oppgave}
            >
              <TableColumn>{oppgave.navn ? `${oppgave.navn} ${oppgave.personnummer}` : '<navn>'}</TableColumn>
              <TableColumn>{oppgave.behandlingstype.navn}</TableColumn>
              <TableColumn>{oppgave.opprettetTidspunkt && <DateLabel dateString={oppgave.opprettetTidspunkt} />}</TableColumn>
              <TableColumn>
                {oppgave.status.flyttetReservasjon && (
                <Image
                  src={bubbletextUrl}
                  srcHover={bubbletextFilledUrl}
                  alt={intl.formatMessage({ id: 'OppgaverTabell.OverfortReservasjon' })}
                  tooltip={createTooltip(oppgave.status)}
                />
                )}
              </TableColumn>
              {oppgave.underBehandling && (
              <TableColumn className={styles.reservertTil}>
                <FormattedMessage
                  id="OppgaveHandlingerMenu.ReservertTil"
                  values={{
                    ...getDateAndTime(oppgave.status.reservertTilTidspunkt),
                    b: (...chunks) => <b>{chunks}</b>,
                  }}
                />
              </TableColumn>
              )}
              {!oppgave.underBehandling && (
              <TableColumn />
              )}
              <TableColumn className={oppgave.underBehandling ? styles.noPadding : undefined}>
                {!oppgave.underBehandling && <NavFrontendChevron /> }
                {oppgave.underBehandling && (
                <div ref={(el) => { ref.current = { ...ref.current, [oppgave.eksternId]: el }; }}>
                  <Image
                    className={styles.image}
                    src={menuIconBlackUrl}
                    srcHover={menuIconBlueUrl}
                    alt={intl.formatMessage({ id: 'OppgaverTabell.OppgaveHandlinger' })}
                    onMouseDown={getToggleMenuEvent(oppgave, toggleMenu)}
                    onKeyDown={getToggleMenuEvent(oppgave, toggleMenu)}
                  />
                </div>
                ) }
              </TableColumn>
            </TableRow>
          ))}
        </Table>
        {showMenu && valgtOppgaveId && valgtOppgave && (
        <OppgaveHandlingerMenu
          imageNode={ref.current[valgtOppgaveId]}
          toggleMenu={toggleMenu}
          offset={offset}
          oppgave={valgtOppgave}
          forlengOppgaveReservasjon={forlengOppgaveReservasjonFn}
          hentReserverteOppgaver={hentReserverteOppgaver}
        />
        )}
      </>
      )}
    </>
  );
};

export default injectIntl(OppgaverTabell);
