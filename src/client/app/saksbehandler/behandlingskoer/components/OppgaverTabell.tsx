import React, { Component, ReactNode } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import { bindActionCreators, Dispatch } from 'redux';
import { Normaltekst, Element } from 'nav-frontend-typografi';
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
import { getK9sakHref } from 'app/paths';
import { getK9sakUrl } from 'app/duck';

import OppgaveHandlingerMenu from './menu/OppgaveHandlingerMenu';
import {
  getAntallOppgaverForBehandlingskoResultat, getOppgaverTilBehandling, getReserverteOppgaver, finnSaksbehandler, leggTilBehandletOppgave, resetSaksbehandler,
} from '../duck';

import styles from './oppgaverTabell.less';

const headerTextCodes = [
  'OppgaverTabell.Soker',
  'OppgaverTabell.Behandlingstype',
  'OppgaverTabell.BehandlingOpprettet',
  'EMPTY_1',
  'EMPTY_2',
];

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
  oppgaverTilBehandling: Oppgave[];
  reserverteOppgaver: Oppgave[];
  reserverOppgave: (oppgave: Oppgave) => void;
  opphevOppgaveReservasjon: (oppgaveId: string, begrunnelse: string) => Promise<any>;
  forlengOppgaveReservasjon: (oppgaveId: string) => Promise<any>;
  endreOppgaveReservasjon: (oppgaveId: string, reserverTil: string) => Promise<string>;
  finnSaksbehandler: (brukerIdent: string) => Promise<string>;
  resetSaksbehandler: () => Promise<string>;
  flyttReservasjon: (oppgaveId: string, brukerident: string, begrunnelse: string) => Promise<string>;
  antall: number;
  goToFagsak: (saknummer: string, behandlingId?: number) => void;
  leggTilBehandletOppgave: (oppgave: Oppgave) => void;
  valgtKoSkjermet: boolean;
}

interface State {
  showMenu: boolean;
  valgtOppgaveId?: string;
  offset: {
    left: number;
    top: number;
  };
}

/**
 * OppgaverTabell
 */
export class OppgaverTabell extends Component<OwnProps & WrappedComponentProps, State> {
  nodes: any;

  constructor(props) {
    super(props);

    this.state = {
      showMenu: false,
      valgtOppgaveId: undefined,
      offset: {
        left: 0,
        top: 0,
      },
    };
  }

  leggTilBehandletSak = (oppgave: Oppgave) => {
    const { leggTilBehandletOppgave: leggTilBehandlet } = this.props;
    leggTilBehandlet(oppgave);
  };

  goToFagsak = (event: Event, id: number, oppgave: Oppgave) => {
    const { reserverOppgave } = this.props;
    if (this.nodes && Object.keys(this.nodes).some((key) => this.nodes[key] && this.nodes[key].contains(event.target))) {
      return;
    }
    this.leggTilBehandletSak(oppgave);
    reserverOppgave(oppgave);
  };

  toggleMenu = (valgtOppgave: Oppgave) => {
    const { showMenu } = this.state;
    const offset = this.nodes[valgtOppgave.eksternId].getBoundingClientRect();
    this.setState(() => ({
      valgtOppgaveId: valgtOppgave.eksternId,
      showMenu: !showMenu,
      offset: { top: offset.top, left: offset.left },
    }));
  }

  createTooltip = (oppgaveStatus: OppgaveStatus): ReactNode | undefined => {
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
  }

  render = () => {
    const {
      oppgaverTilBehandling, reserverteOppgaver, opphevOppgaveReservasjon, forlengOppgaveReservasjon, endreOppgaveReservasjon,
      finnSaksbehandler: findSaksbehandler, flyttReservasjon,
      resetSaksbehandler: resetBehandler, antall, intl, valgtKoSkjermet,
    } = this.props;
    const {
      showMenu, offset, valgtOppgaveId,
    } = this.state;

    const alleOppgaver = slaSammenOgMarkerReserverte(reserverteOppgaver, oppgaverTilBehandling);
    const valgtOppgave = reserverteOppgaver.find((o) => o.eksternId === valgtOppgaveId);

    return (
      <>
        <Element><FormattedMessage id="OppgaverTabell.DineNesteSaker" values={{ antall }} /></Element>
        {alleOppgaver.length === 0 && (valgtKoSkjermet === false) && (
          <>
            <VerticalSpacer eightPx />
            <Normaltekst><FormattedMessage id="OppgaverTabell.IngenOppgaver" /></Normaltekst>
          </>
        )}

        {alleOppgaver.length === 0 && (valgtKoSkjermet === true) && (
        <>
          <VerticalSpacer eightPx />
          <Normaltekst><FormattedMessage id="OppgaverTabell.IngenTilgang" /></Normaltekst>
        </>
        )}
        {alleOppgaver.length > 0 && (
          <>
            <Table headerTextCodes={headerTextCodes}>
              {alleOppgaver.map((oppgave) => (
                <TableRow
                  key={oppgave.eksternId}
                  onMouseDown={this.goToFagsak}
                  onKeyDown={this.goToFagsak}
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
                      tooltip={this.createTooltip(oppgave.status)}
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
                      <div ref={(node) => { this.nodes = { ...this.nodes, [oppgave.eksternId]: node }; }}>
                        <Image
                          className={styles.image}
                          src={menuIconBlackUrl}
                          srcHover={menuIconBlueUrl}
                          alt={intl.formatMessage({ id: 'OppgaverTabell.OppgaveHandlinger' })}
                          onMouseDown={getToggleMenuEvent(oppgave, this.toggleMenu)}
                          onKeyDown={getToggleMenuEvent(oppgave, this.toggleMenu)}
                        />
                      </div>
                    ) }
                  </TableColumn>
                </TableRow>
              ))}
            </Table>
            {showMenu && valgtOppgaveId && valgtOppgave && (
            <OppgaveHandlingerMenu
              imageNode={this.nodes[valgtOppgaveId]}
              toggleMenu={this.toggleMenu}
              offset={offset}
              oppgave={valgtOppgave}
              opphevOppgaveReservasjon={opphevOppgaveReservasjon}
              forlengOppgaveReservasjon={forlengOppgaveReservasjon}
              endreOppgaveReservasjon={endreOppgaveReservasjon}
              finnSaksbehandler={findSaksbehandler}
              resetSaksbehandler={resetBehandler}
              flyttReservasjon={flyttReservasjon}
            />
            )}
          </>
        )}
      </>
    );
  }
}

const getGoToFagsakFn = (k9sakUrl) => (saksnummer, behandlingId) => {
  window.location.assign(getK9sakHref(k9sakUrl, saksnummer, behandlingId));
};

const mapStateToProps = (state) => ({
  antall: getAntallOppgaverForBehandlingskoResultat(state) || 0,
  oppgaverTilBehandling: getOppgaverTilBehandling(state) || [],
  reserverteOppgaver: getReserverteOppgaver(state) || [],
  goToFagsak: getGoToFagsakFn(getK9sakUrl(state)),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators({
    finnSaksbehandler,
    resetSaksbehandler,
    leggTilBehandletOppgave,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(OppgaverTabell));
