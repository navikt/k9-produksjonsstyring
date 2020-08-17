import React, { Component, ReactNode } from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import Reservasjon from 'avdelingsleder/reservasjoner/reservasjonTsType';
import Image from 'sharedComponents/Image';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { getDateAndTime } from 'utils/dateUtils';

import TableColumn from 'sharedComponents/TableColumn';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import NavFrontendSpinner from 'nav-frontend-spinner';
import styles from './reservasjonerTabell.less';
import HandlingerMenu from './HandlingerMenu';
import menuIconBlackUrl from '../../../../images/ic-menu-18px_black.svg';
import menuIconBlueUrl from '../../../../images/ic-menu-18px_blue.svg';

const headerTextCodes = [
  'ReservasjonerTabell.Navn',
  'ReservasjonerTabell.Saksnr',
  'ReservasjonerTabell.BehandlingType',
  'ReservasjonerTabell.ReservertTil',
  'EMPTY_1',
];


interface OwnProps {
  reservasjoner: Reservasjon[];
  opphevReservasjon: (oppgaveId: string) => Promise<string>;
  hentAlleReservasjoner: () => void;
  endreOppgaveReservasjon: (oppgaveId: string, reserverTil: string) => Promise<string>;
  finnSaksbehandler: (brukerIdent: string) => Promise<string>;
  resetSaksbehandler: () => Promise<string>;
  flyttReservasjon: (oppgaveId: string, brukerident: string, begrunnelse: string) => Promise<string>;
  requestFinished: boolean;
}

interface State {
  valgtReservasjon?: Reservasjon;
  showMenu: boolean;
  valgtOppgaveId?: string;
  offset: {
    left: number;
    top: number;
  };
}

export class ReservasjonerTabell extends Component<OwnProps & WrappedComponentProps, State> {
  nodes: any;

  constructor(props: OwnProps) {
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


  closeReservasjonEndringDatoModal = (): void => {
    this.setState((prevState) => ({ ...prevState, showReservasjonEndringDatoModal: false }));
  }

  showFlytteModal = (reservasjon: Reservasjon): void => {
    this.setState((prevState) => ({ ...prevState, showFlyttReservasjonModal: true, valgtReservasjon: reservasjon }));
  }

  closeFlytteModal = (): void => {
    this.setState((prevState) => ({ ...prevState, showFlyttReservasjonModal: false }));
  }

  toggleMenu = (reservasjon: Reservasjon) => {
    const { showMenu } = this.state;
    const offset = this.nodes[reservasjon.oppgaveId].getBoundingClientRect();
    this.setState(() => ({
      valgtOppgaveId: reservasjon.oppgaveId,
      vaalgtReservasjon: reservasjon,
      showMenu: !showMenu,
      offset: { top: offset.top, left: offset.left },
    }));
  }

  endreReservasjon = (oppgaveId: string, reserverTil: string) => {
    const { endreOppgaveReservasjon } = this.props;
    return endreOppgaveReservasjon(oppgaveId, reserverTil).then((this.closeReservasjonEndringDatoModal));
  }

  flyttReservasjon = (oppgaveId: string, brukerident: string, begrunnelse: string) => {
    const { flyttReservasjon } = this.props;
    flyttReservasjon(oppgaveId, brukerident, begrunnelse).then((this.closeFlytteModal));
  }

  render = (): ReactNode => {
    const {
      reservasjoner, opphevReservasjon, finnSaksbehandler, resetSaksbehandler, intl, requestFinished,
    } = this.props;
    const {
      showMenu, valgtOppgaveId, offset,
    } = this.state;

    const sorterteReservasjoner = reservasjoner.sort((reservasjon1, reservasjon2) => reservasjon1.reservertAvNavn.localeCompare(reservasjon2.reservertAvNavn));
    const valgtReservasjon = sorterteReservasjoner.find((r) => r.oppgaveId === valgtOppgaveId);
    return (
      <>
        <Element><FormattedMessage id="ReservasjonerTabell.Reservasjoner" /></Element>
        {sorterteReservasjoner.length === 0 && !requestFinished && (
        <NavFrontendSpinner type="XL" className={styles.container} />
        )}
        {sorterteReservasjoner.length === 0 && (
          <>
            <VerticalSpacer eightPx />
            <Normaltekst><FormattedMessage id="ReservasjonerTabell.IngenReservasjoner" /></Normaltekst>
            <VerticalSpacer eightPx />
          </>
        )}
        {sorterteReservasjoner.length > 0 && (
        <>
          <Table headerTextCodes={headerTextCodes} noHover>
            {sorterteReservasjoner.map((reservasjon) => (
              <TableRow key={reservasjon.oppgaveId}>
                <TableColumn>{reservasjon.reservertAvNavn}</TableColumn>
                <TableColumn>{reservasjon.saksnummer}</TableColumn>
                <TableColumn>{reservasjon.behandlingType.navn}</TableColumn>
                <TableColumn>
                  <FormattedMessage
                    id="ReservasjonerTabell.ReservertTilFormat"
                    values={getDateAndTime(reservasjon.reservertTilTidspunkt)}
                  />
                </TableColumn>
                <TableColumn>
                  <div ref={(node) => { this.nodes = { ...this.nodes, [reservasjon.oppgaveId]: node }; }}>
                    <Image
                      className={styles.image}
                      src={menuIconBlackUrl}
                      srcHover={menuIconBlueUrl}
                      alt={intl.formatMessage({ id: 'OppgaverTabell.OppgaveHandlinger' })}
                      onMouseDown={() => this.toggleMenu(reservasjon)}
                      onKeyDown={() => this.toggleMenu(reservasjon)}
                    />
                  </div>
                </TableColumn>
              </TableRow>
            ))}
          </Table>
          {showMenu && (
          <HandlingerMenu
            imageNode={this.nodes[valgtReservasjon.oppgaveId]}
            toggleMenu={this.toggleMenu}
            offset={offset}
            reservasjon={valgtReservasjon}
            opphevOppgaveReservasjon={() => opphevReservasjon(valgtReservasjon.oppgaveId)}
            endreOppgaveReservasjon={this.endreReservasjon}
            finnSaksbehandler={finnSaksbehandler}
            resetSaksbehandler={resetSaksbehandler}
            flyttReservasjon={this.flyttReservasjon}
          />
          )}
        </>
        )}
      </>
    );
  }
}

export default injectIntl(ReservasjonerTabell);
