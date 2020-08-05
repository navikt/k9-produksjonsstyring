import React, { Component, MouseEvent } from 'react';
import { FormattedMessage } from 'react-intl';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import Reservasjon from 'avdelingsleder/reservasjoner/reservasjonTsType';
import MenuButton from '../../../saksbehandler/behandlingskoer/components/menu/MenuButton';
import OpphevReservasjonModal from '../../../saksbehandler/behandlingskoer/components/menu/OpphevReservasjonModal';
import FlyttReservasjonModal from '../../../saksbehandler/behandlingskoer/components/menu/FlyttReservasjonModal';
import OppgaveReservasjonEndringDatoModal from '../../../saksbehandler/behandlingskoer/components/menu/OppgaveReservasjonEndringDatoModal';

import styles from './handlingerMenu.less';

const getOffsetPositionStyle = (offset) => (window.innerWidth > (offset.left + 250)
  ? { left: `${42 + offset.left}px`, top: `${offset.top - 20}px` }
  : { left: `${offset.left - 200}px`, top: `${offset.top + 38}px` });

const toggleEventListeners = (turnOnEventListeners, handleOutsideClick) => {
  if (turnOnEventListeners) {
    document.addEventListener('click', handleOutsideClick, false);
    document.addEventListener('mousedown', handleOutsideClick, false);
    document.addEventListener('keydown', handleOutsideClick, false);
  } else {
    document.removeEventListener('click', handleOutsideClick, false);
    document.removeEventListener('mousedown', handleOutsideClick, false);
    document.removeEventListener('keydown', handleOutsideClick, false);
  }
};

interface OwnProps {
    toggleMenu: (reservasjon: Reservasjon) => void;
    offset: {
        top: number;
        left: number;
    };
    reservasjon: Reservasjon;
    imageNode: any;
    opphevOppgaveReservasjon: (oppgaveId: string) => Promise<string>;
    endreOppgaveReservasjon: (oppgaveId: string, reserverTil: string) => Promise<string>;
    finnSaksbehandler: (brukerIdent: string) => Promise<string>;
    resetSaksbehandler: () => Promise<string>;
    flyttReservasjon: (oppgaveId: string, brukerident: string, begrunnelse: string) => void;
}

interface OwnState {
    showOpphevReservasjonModal: boolean;
    showForlengetReservasjonModal: boolean;
    showFlyttReservasjonModal: boolean;
    showReservasjonEndringDatoModal: boolean;
}

/**
 * OppgaveHandlingerMenu
 */
export class HandlingerMenu extends Component<OwnProps, OwnState> {
    node: any;

    menuButtonRef: any;

    constructor(props) {
      super(props);

      this.state = {
        showOpphevReservasjonModal: false,
        showForlengetReservasjonModal: false,
        showReservasjonEndringDatoModal: false,
        showFlyttReservasjonModal: false,
      };

      this.menuButtonRef = React.createRef();
      toggleEventListeners(true, this.handleOutsideClick);
    }

    componentDidMount = () => {
      if (this.menuButtonRef && this.menuButtonRef.current) {
        this.menuButtonRef.current.focus();
      }
    }

    componentWillUnmount = () => {
      toggleEventListeners(false, this.handleOutsideClick);
    }

    handleOutsideClick = (event: MouseEvent<HTMLButtonElement>) => {
      const { imageNode } = this.props;
      // ignore clicks on the component itself
      const harKlikketMeny = this.node && this.node.contains(event.target);
      const harKlikketIkon = imageNode && imageNode.contains(event.target);
      if (harKlikketMeny || harKlikketIkon) {
        return;
      }

      const { toggleMenu, reservasjon } = this.props;
      toggleMenu(reservasjon);
    }

    showBegrunnelseModal = () => {
      toggleEventListeners(false, this.handleOutsideClick);
      this.setState((prevState) => ({ ...prevState, showOpphevReservasjonModal: true }));
    }

    closeBegrunnelseModal = () => {
      const { toggleMenu, reservasjon } = this.props;
      toggleMenu(reservasjon);
      toggleEventListeners(true, this.handleOutsideClick);
      this.setState((prevState) => ({ ...prevState, showOpphevReservasjonModal: false }));
    }

    showFlytteModal = () => {
      toggleEventListeners(false, this.handleOutsideClick);
      this.setState((prevState) => ({ ...prevState, showFlyttReservasjonModal: true }));
    }

    showReservasjonEndringDato = () => {
      toggleEventListeners(false, this.handleOutsideClick);
      this.setState((prevState) => ({ ...prevState, showReservasjonEndringDatoModal: true }));
    }

    closeFlytteModal = () => {
      const { toggleMenu, reservasjon } = this.props;
      toggleMenu(reservasjon);
      toggleEventListeners(true, this.handleOutsideClick);
      this.setState((prevState) => ({ ...prevState, showFlyttReservasjonModal: false }));
    }

    closeReservasjonEndringDatoModal = (event: MouseEvent<HTMLButtonElement>) => {
      const { toggleMenu, reservasjon } = this.props;
      toggleMenu(reservasjon);
      this.handleOutsideClick(event);
    }

    closeForlengReservasjonModal = (event: MouseEvent<HTMLButtonElement>) => {
      const { toggleMenu, reservasjon } = this.props;
      toggleMenu(reservasjon);
      this.handleOutsideClick(event);
    }

    opphevReserverasjon = (oppgaveId: string) => {
      const { opphevOppgaveReservasjon } = this.props;
      opphevOppgaveReservasjon(oppgaveId);
      const { toggleMenu, reservasjon } = this.props;
      toggleMenu(reservasjon);
    }

    flyttReservasjon = (oppgaveId: string, brukerident: string, begrunnelse: string) => {
      const { flyttReservasjon } = this.props;
      flyttReservasjon(oppgaveId, brukerident, begrunnelse);
      const { toggleMenu, reservasjon } = this.props;
      toggleMenu(reservasjon);
    }


    render = () => {
      const {
        reservasjon, offset, finnSaksbehandler, resetSaksbehandler, endreOppgaveReservasjon,
      } = this.props;
      const {
        showOpphevReservasjonModal, showFlyttReservasjonModal, showReservasjonEndringDatoModal,
      } = this.state;

      return (
        <>
          <div className={styles.containerMenu} style={getOffsetPositionStyle(offset)} ref={(node) => { this.node = node; }}>
            <VerticalSpacer eightPx />
            <MenuButton onClick={this.showBegrunnelseModal} ref={this.menuButtonRef}>
              <FormattedMessage id="OppgaveHandlingerMenu.LeggTilbake" values={{ br: <br /> }} />
            </MenuButton>
            <MenuButton onClick={this.showReservasjonEndringDato}>
              <FormattedMessage id="OppgaveHandlingerMenu.EndreReservasjon" />
            </MenuButton>
            <MenuButton onClick={this.showFlytteModal}>
              <FormattedMessage id="OppgaveHandlingerMenu.FlyttReservasjon" values={{ br: <br /> }} />
            </MenuButton>
          </div>
          {showOpphevReservasjonModal && (
            <OpphevReservasjonModal
              oppgaveId={reservasjon.oppgaveId}
              showModal={showOpphevReservasjonModal}
              cancel={this.closeBegrunnelseModal}
              submit={this.opphevReserverasjon}
            />
          )}
          {showReservasjonEndringDatoModal && (
            <OppgaveReservasjonEndringDatoModal
              showModal={showReservasjonEndringDatoModal}
              oppgaveId={reservasjon.oppgaveId}
              endreOppgaveReservasjon={endreOppgaveReservasjon}
              closeModal={this.closeReservasjonEndringDatoModal}
              reserverTilDefault={reservasjon.reservertTilTidspunkt}
            />
          )}
          { showFlyttReservasjonModal && (
            <FlyttReservasjonModal
              oppgaveId={reservasjon.oppgaveId}
              showModal={showFlyttReservasjonModal}
              closeModal={this.closeFlytteModal}
              submit={this.flyttReservasjon}
              finnSaksbehandler={finnSaksbehandler}
              resetSaksbehandler={resetSaksbehandler}
            />
          )}
        </>
      );
    }
}

export default HandlingerMenu;
