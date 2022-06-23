import React, { FunctionComponent, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { FormattedMessage, injectIntl, useIntl, WrappedComponentProps } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import { getDateAndTime } from 'utils/dateUtils';
import Image from 'sharedComponents/Image';
import Oppgave from 'saksbehandler/oppgaveTsType';
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
import Reservasjon from 'avdelingsleder/reservasjoner/reservasjonTsType';
import {
  getHeaderCodes,
  hentIDFraSak,
} from 'saksbehandler/behandlingskoer/components/oppgavetabeller/oppgavetabellerfelles';
import { OppgaveStatus } from 'saksbehandler/oppgaveStatusTsType';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import AlleKodeverk from 'kodeverk/alleKodeverkTsType';
import { useGlobalStateRestApiData } from 'api/rest-api-hooks';
import { getKodeverknavnFraKode } from 'utils/kodeverkUtils';
import OppgaveHandlingerMenu from '../menu/OppgaveHandlingerMenu';
import styles from './oppgaverTabell.less';

interface OwnProps {
  apneOppgave: (oppgave: Oppgave) => void;
  reserverteOppgaver: Oppgave[];
  hentReserverteOppgaver: () => void;
  requestFinished: boolean;
}

const ReserverteOppgaverTabell: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  apneOppgave,
  reserverteOppgaver,
  hentReserverteOppgaver,
  requestFinished,
}) => {
  const intl = useIntl();
  const [showMenu, setShowMenu] = useState(false);
  const [reserverteOppgaverState, setReserverteOppgaveState] = useState<Oppgave[]>(reserverteOppgaver);
  const [requestFinishedState, setRequestFinishedState] = useState<boolean>(requestFinished);

  const [valgtOppgaveId, setValgtOppgaveId] = useState<string>();
  const [offset, setOffset] = useState({
    left: 0,
    top: 0,
  });

  const alleKodeverk: AlleKodeverk = useGlobalStateRestApiData(RestApiGlobalStatePathsKeys.KODEVERK);

  const { startRequest: leggTilBehandletOppgave } = useRestApiRunner(K9LosApiKeys.LEGG_TIL_BEHANDLET_OPPGAVE);
  const { startRequest: forlengOppgavereservasjon } = useRestApiRunner<Reservasjon[]>(
    K9LosApiKeys.FORLENG_OPPGAVERESERVASJON,
  );

  const initialRender = useRef(true);

  useEffect(() => {
    if (!showMenu) {
      if (
        reserverteOppgaver.length !== reserverteOppgaverState.length ||
        !reserverteOppgaver.every(oppgave => reserverteOppgaverState.includes(oppgave))
      ) {
        setReserverteOppgaveState(reserverteOppgaver);
      }

      if (requestFinished !== requestFinishedState) {
        setRequestFinishedState(requestFinished);
      }
    }
  }, [reserverteOppgaver, requestFinished]);

  useEffect(() => {
    if (!showMenu && !initialRender.current) {
      hentReserverteOppgaver();
    }
  }, [showMenu]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    }
  });

  const forlengOppgaveReservasjonFn = useCallback(
    (oppgaveId: string): Promise<any> => forlengOppgavereservasjon({ oppgaveId }).then(() => hentReserverteOppgaver()),
    [],
  );

  const ref = useRef({});

  const goToFagsak = useCallback(
    (event: Event, id: number, oppgave: Oppgave) => {
      if (
        ref.current &&
        Object.keys(ref.current).some(key => ref.current[key] && ref.current[key].contains(event.target))
      ) {
        return;
      }
      leggTilBehandletOppgave(oppgave);
      apneOppgave(oppgave);
    },
    [ref.current],
  );

  const toggleMenu = useCallback(
    (oppgaveValgt: Oppgave) => {
      const newOffset = ref.current[oppgaveValgt.eksternId]?.getBoundingClientRect();

      if (newOffset) {
        setShowMenu(!showMenu);
        setValgtOppgaveId(oppgaveValgt.eksternId);
        setOffset({ top: newOffset.top, left: newOffset.left });
      }
    },
    [ref.current, showMenu],
  );

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
      <Normaltekst>
        <FormattedMessage id="OppgaverTabell.OverfortReservasjonTooltip" values={textValues} />
      </Normaltekst>
    );
  }, []);

  const valgtOppgave = reserverteOppgaverState.find(o => o.eksternId === valgtOppgaveId);

  return (
    <div>
      {reserverteOppgaverState.length === 0 && !requestFinishedState && (
        <NavFrontendSpinner type="XL" className={styles.spinner} />
      )}

      {reserverteOppgaverState.length === 0 && requestFinishedState && (
        <>
          <VerticalSpacer eightPx />
          <Normaltekst>
            <FormattedMessage id="OppgaverTabell.IngenReserverteOppgaver" />
          </Normaltekst>
        </>
      )}

      {reserverteOppgaverState.length > 0 && requestFinishedState && (
        <>
          <Table headerTextCodes={getHeaderCodes(true)}>
            {reserverteOppgaverState.map(oppgave => (
              <TableRow
                key={oppgave.eksternId}
                onMouseDown={goToFagsak}
                onKeyDown={goToFagsak}
                className={styles.isUnderBehandling}
                model={oppgave}
              >
                <TableColumn>{oppgave.navn ? `${oppgave.navn} ${oppgave.personnummer}` : '<navn>'}</TableColumn>
                <TableColumn>{hentIDFraSak(oppgave, alleKodeverk)}</TableColumn>
                <TableColumn>
                  {getKodeverknavnFraKode(oppgave.behandlingstype, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk)}
                </TableColumn>
                <TableColumn>
                  {oppgave.opprettetTidspunkt && <DateLabel dateString={oppgave.opprettetTidspunkt} />}
                </TableColumn>
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

                <TableColumn className={styles.reservertTil}>
                  <FormattedMessage
                    id="OppgaveHandlingerMenu.ReservertTil"
                    values={{
                      ...getDateAndTime(oppgave.status.reservertTilTidspunkt),
                      b: (...chunks) => <b>{chunks}</b>,
                    }}
                  />
                </TableColumn>

                <TableColumn className={styles.noPadding}>
                  <div
                    ref={el => {
                      ref.current = { ...ref.current, [oppgave.eksternId]: el };
                    }}
                  >
                    <Image
                      className={styles.image}
                      src={menuIconBlackUrl}
                      srcHover={menuIconBlueUrl}
                      alt={intl.formatMessage({ id: 'OppgaverTabell.OppgaveHandlinger' })}
                      onMouseDown={() => toggleMenu(oppgave)}
                      onKeyDown={() => toggleMenu(oppgave)}
                    />
                  </div>
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
    </div>
  );
};

export default injectIntl(ReserverteOppgaverTabell);
