import React, { Component, MouseEvent } from 'react';
import { FormattedMessage } from 'react-intl';
import Oppgave from 'saksbehandler/oppgaveTsType';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import MenuButton from './MenuButton';
import OpphevReservasjonModal from './OpphevReservasjonModal';
import OppgaveReservasjonForlengetModal from './OppgaveReservasjonForlengetModal';
import FlyttReservasjonModal from './FlyttReservasjonModal';
import OppgaveReservasjonEndringDatoModal from './OppgaveReservasjonEndringDatoModal';

import styles from './oppgaveHandlingerMenu.less';

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
  toggleMenu: (valgtOppgave: Oppgave) => void;
  offset: {
    top: number;
    left: number;
  };
  oppgave: Oppgave;
  imageNode: any;
  forlengOppgaveReservasjon: (oppgaveId: string) => Promise<string>;
  hentReserverteOppgaver: (params: any, keepData: boolean) => void;

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
export class OppgaveHandlingerMenu extends Component<OwnProps, OwnState> {
  node: any;

  menuButtonRef: any;

  stateRef: any;

  constructor(props) {
    super(props);

    this.state = {
      showOpphevReservasjonModal: false,
      showForlengetReservasjonModal: false,
      showReservasjonEndringDatoModal: false,
      showFlyttReservasjonModal: false,
    };

    this.menuButtonRef = React.createRef();
    this.stateRef = React.createRef();
    this.stateRef.current = this.state;
    // eslint-disable-next-line
    console.log('setter stateRefCurrent', this.stateRef.current);

    toggleEventListeners(true, this.handleOutsideClick);
  }

  componentDidMount = () => {
    if (this.menuButtonRef && this.menuButtonRef.current) {
      this.menuButtonRef.current.focus();
    }

    if (this.stateRef.current) {
      // eslint-disable-next-line
      console.log('Setting state w:', this.stateRef.current);
      this.setState(() => ({ ...this.stateRef.current }));
    }
  }

  componentWillUnmount = () => {
    toggleEventListeners(false, this.handleOutsideClick);
    // eslint-disable-next-line
    console.log('Unmounting state w:', this.stateRef.current);

    if (this.stateRef.current) { this.stateRef.current = this.state; }
  }

  handleOutsideClick = (event: MouseEvent<HTMLButtonElement>) => {
    const { imageNode } = this.props;
    // ignore clicks on the component itself

    if (event && event.target) {
      const harKlikketMeny = this.node && this.node.contains(event.target);
      const harKlikketIkon = imageNode && imageNode.contains(event.target);
      if (harKlikketMeny || harKlikketIkon) {
        return;
      }
    }

    const { toggleMenu, oppgave } = this.props;
    toggleMenu(oppgave);
  }

  showBegrunnelseModal = () => {
    toggleEventListeners(false, this.handleOutsideClick);
    this.setState((prevState) => ({ ...prevState, showOpphevReservasjonModal: true }));
  }

  closeBegrunnelseModal = () => {
    const { toggleMenu, oppgave } = this.props;
    toggleMenu(oppgave);
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
    const { toggleMenu, oppgave } = this.props;
    toggleMenu(oppgave);
    toggleEventListeners(true, this.handleOutsideClick);
    this.setState((prevState) => ({ ...prevState, showFlyttReservasjonModal: false }));
  }

  closeReservasjonEndringDatoModal = (event: MouseEvent<HTMLButtonElement>) => {
    const { toggleMenu, oppgave } = this.props;
    toggleMenu(oppgave);
    this.handleOutsideClick(event);
    this.setState((prevState) => ({ ...prevState, showForlengetReservasjonModal: true }));
  }

  closeForlengReservasjonModal = (event: MouseEvent<HTMLButtonElement>) => {
    const { toggleMenu, oppgave } = this.props;
    toggleMenu(oppgave);
    this.handleOutsideClick(event);
  }

  forlengReserverasjon = () => {
    const { oppgave, forlengOppgaveReservasjon } = this.props;
    forlengOppgaveReservasjon(oppgave.eksternId).then(() => {
      toggleEventListeners(false, this.handleOutsideClick);
      this.setState((prevState) => ({ ...prevState, showForlengetReservasjonModal: true }));
    });
  }

  toggleMeny = () => {
    const { toggleMenu, oppgave } = this.props;
    toggleMenu(oppgave);
  }

  render = () => {
    const {
      oppgave, offset, hentReserverteOppgaver,
    } = this.props;
    const {
      showOpphevReservasjonModal, showForlengetReservasjonModal, showFlyttReservasjonModal, showReservasjonEndringDatoModal,
    } = this.state;

    return (
      <>
        <div className={styles.containerMenu} style={getOffsetPositionStyle(offset)} ref={(node) => { this.node = node; }}>
          <VerticalSpacer eightPx />
          <MenuButton onClick={this.showBegrunnelseModal} ref={this.menuButtonRef}>
            <FormattedMessage id="OppgaveHandlingerMenu.LeggTilbake" values={{ br: <br /> }} />
          </MenuButton>
          <MenuButton onClick={this.forlengReserverasjon}>
            <FormattedMessage id="OppgaveHandlingerMenu.ForlengReservasjon" values={{ br: <br /> }} />
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
            oppgaveId={oppgave.eksternId}
            showModal={showOpphevReservasjonModal}
            cancel={this.closeBegrunnelseModal}
            toggleMenu={this.toggleMeny}
            hentReserverteOppgaver={hentReserverteOppgaver}
          />
        )}
        {showReservasjonEndringDatoModal && (
        <OppgaveReservasjonEndringDatoModal
          showModal={showReservasjonEndringDatoModal}
          oppgaveId={oppgave.eksternId}
          hentAlleReservasjonerEllerOppgaver={hentReserverteOppgaver}
          closeModal={this.closeReservasjonEndringDatoModal}
          reserverTilDefault={oppgave.status.reservertTilTidspunkt}
        />
        )}
        {showForlengetReservasjonModal
          && <OppgaveReservasjonForlengetModal oppgave={oppgave} showModal={showForlengetReservasjonModal} closeModal={this.closeForlengReservasjonModal} />}
        { showFlyttReservasjonModal && (
          <FlyttReservasjonModal
            oppgaveId={oppgave.eksternId}
            showModal={showFlyttReservasjonModal}
            closeModal={this.closeFlytteModal}
            hentAlleReservasjonerEllerOppgaver={hentReserverteOppgaver}
          />
        )}
      </>
    );
  }
}

export default OppgaveHandlingerMenu;
