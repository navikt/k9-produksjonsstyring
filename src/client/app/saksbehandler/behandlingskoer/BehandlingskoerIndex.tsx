import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import k9LosApi from 'api/k9LosApi';
import { getK9sakHref, getK9tilbakeHref } from 'app/paths';
import sakslistePropType from 'saksbehandler/behandlingskoer/sakslistePropType';
import { Saksliste } from 'saksbehandler/behandlingskoer/sakslisteTsType';
import { getK9sakUrl, getK9tilbakeUrl } from 'app/duck';
import { OppgaveStatus } from 'saksbehandler/oppgaveStatusTsType';
import { Oppgave } from 'saksbehandler/oppgaveTsType';
import OppgaveErReservertAvAnnenModal from 'saksbehandler/components/OppgaveErReservertAvAnnenModal';
import {
  fetchAlleSakslister, getSakslisteResult, fetchOppgaverTilBehandling, fetchReserverteOppgaver, reserverOppgave, opphevOppgaveReservasjon,
  forlengOppgaveReservasjon, fetchOppgaverTilBehandlingOppgaver, flyttReservasjon, setValgtSakslisteId,
} from './duck';
import SakslistePanel from './components/SakslistePanel';

type TsProps = Readonly<{
  fetchOppgaverTilBehandling: (sakslisteId: number) => Promise<{payload: any }>;
  fetchOppgaverTilBehandlingOppgaver: (sakslisteId: number, oppgaveIder?: string) => Promise<{payload: any }>;
  fetchAlleSakslister: () => void;
  fetchReserverteOppgaver: (sakslisteId: number) => Promise<{payload: any }>;
  reserverOppgave: (oppgaveId: string) => Promise<{payload: OppgaveStatus }>;
  opphevOppgaveReservasjon: (oppgaveId: string, begrunnelse: string) => Promise<string>;
  forlengOppgaveReservasjon: (oppgaveId: string) => Promise<string>;
  flyttReservasjon: (oppgaveId: string, brukerident: string, begrunnelse: string) => Promise<string>;
  sakslister: Saksliste[];
  k9sakUrl: string;
  k9tilbakeUrl: string;
  goToUrl: (url: string) => void;
  setValgtSakslisteId: (sakslisteId: number) => void;
}>

interface StateProps {
  sakslisteId?: number;
  reservertAvAnnenSaksbehandler: boolean;
  reservertOppgave?: Oppgave;
  reservertOppgaveStatus?: OppgaveStatus;
}
/**
 * BehandlingskoerIndex
 */
export class BehandlingskoerIndex extends Component<TsProps, StateProps> {
  state = {
    sakslisteId: undefined, reservertAvAnnenSaksbehandler: false, reservertOppgave: undefined, reservertOppgaveStatus: undefined,
  };

  static propTypes = {
    fetchOppgaverTilBehandling: PropTypes.func.isRequired,
    fetchOppgaverTilBehandlingOppgaver: PropTypes.func.isRequired,
    fetchAlleSakslister: PropTypes.func.isRequired,
    fetchReserverteOppgaver: PropTypes.func.isRequired,
    reserverOppgave: PropTypes.func.isRequired,
    opphevOppgaveReservasjon: PropTypes.func.isRequired,
    forlengOppgaveReservasjon: PropTypes.func.isRequired,
    flyttReservasjon: PropTypes.func.isRequired,
    sakslister: PropTypes.arrayOf(sakslistePropType),
    k9sakUrl: PropTypes.string.isRequired,
    k9tilbakeUrl: PropTypes.string.isRequired,
    goToUrl: PropTypes.func.isRequired,
    setValgtSakslisteId: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sakslister: [],
  }

  componentDidMount = () => {
    const { fetchAlleSakslister: getSakslister } = this.props;
    getSakslister();
  }

  componentWillUnmount = () => {
    const { sakslisteId: id } = this.state;
    if (id) {
      k9LosApi.OPPGAVER_TIL_BEHANDLING.cancelRestApiRequest();
    }
  }

  fetchSakslisteOppgaverPolling = (sakslisteId: number, oppgaveIder?: string) => {
    const { fetchOppgaverTilBehandlingOppgaver: fetchTilBehandling, fetchReserverteOppgaver: fetchReserverte } = this.props;
    fetchReserverte(sakslisteId);
    fetchTilBehandling(sakslisteId, oppgaveIder);
  }

  fetchSakslisteOppgaver = (sakslisteId: number) => {
    this.setState(prevState => ({ ...prevState, sakslisteId }));
    const { fetchOppgaverTilBehandling: fetchTilBehandling, fetchReserverteOppgaver: fetchReserverte, setValgtSakslisteId: setSakslisteId } = this.props;
    setSakslisteId(sakslisteId);
    fetchReserverte(sakslisteId);
    fetchTilBehandling(sakslisteId).then((response) => {
      const { sakslisteId: id } = this.state;
      return sakslisteId === id ? this.fetchSakslisteOppgaverPolling(sakslisteId, response.payload.map(o => o.id).join(',')) : Promise.resolve();
    });
  }

  openSak = (oppgave: Oppgave) => {
    if (oppgave.system === 'K9SAK') this.openFagsak(oppgave);
    else if (oppgave.system === 'K9TILBAKE') this.openTilbakesak(oppgave);
    else throw new Error('Fagsystemet for oppgaven er ukjent');
  }

  openFagsak = (oppgave: Oppgave) => {
    const { k9sakUrl, goToUrl } = this.props;
    goToUrl(getK9sakHref(k9sakUrl, oppgave.saksnummer, oppgave.behandlingId));
  }

  openTilbakesak = (oppgave: Oppgave) => {
    const { k9tilbakeUrl, goToUrl } = this.props;
    goToUrl(getK9tilbakeHref(k9tilbakeUrl, oppgave.saksnummer, oppgave.eksternId));
  }

  reserverOppgaveOgApne = (oppgave: Oppgave) => {
    if (oppgave.status.erReservert) {
      this.openSak(oppgave);
    } else {
      const { reserverOppgave: reserver } = this.props;

      reserver(oppgave.eksternId).then((data: {payload: OppgaveStatus }) => {
        const nyOppgaveStatus = data.payload;
        if (nyOppgaveStatus.erReservert && nyOppgaveStatus.erReservertAvInnloggetBruker) {
          this.openSak(oppgave);
        } else if (nyOppgaveStatus.erReservert && !nyOppgaveStatus.erReservertAvInnloggetBruker) {
          this.setState(prevState => ({
            ...prevState,
            reservertAvAnnenSaksbehandler: true,
            reservertOppgave: oppgave,
            reservertOppgaveStatus: nyOppgaveStatus,
          }));
        }
      });
    }
  }

  opphevReservasjon = (oppgaveId: string, begrunnelse: string): Promise<any> => {
    const { opphevOppgaveReservasjon: opphevReservasjon, fetchReserverteOppgaver: fetchReserverte } = this.props;
    const { sakslisteId } = this.state;
    if (!sakslisteId) {
      return Promise.resolve();
    }
    return opphevReservasjon(oppgaveId, begrunnelse)
      .then(() => fetchReserverte(sakslisteId));
  }

  forlengOppgaveReservasjon = (oppgaveId: string): Promise<any> => {
    const { forlengOppgaveReservasjon: forlengReservasjon, fetchReserverteOppgaver: fetchReserverte } = this.props;
    const { sakslisteId } = this.state;
    if (!sakslisteId) {
      return Promise.resolve();
    }
    return forlengReservasjon(oppgaveId)
      .then(() => fetchReserverte(sakslisteId));
  }

  flyttReservasjon = (oppgaveId: string, brukerident: string, begrunnelse: string): Promise<any> => {
    const { flyttReservasjon: flytt, fetchReserverteOppgaver: fetchReserverte } = this.props;
    const { sakslisteId } = this.state;
    if (!sakslisteId) {
      return Promise.resolve();
    }
    return flytt(oppgaveId, brukerident, begrunnelse)
      .then(() => fetchReserverte(sakslisteId));
  }

  lukkErReservertModalOgOpneOppgave = (oppgave: Oppgave) => {
    this.setState(prevState => ({
      ...prevState, reservertAvAnnenSaksbehandler: false, reservertOppgave: undefined, reservertOppgaveStatus: undefined,
    }));
    this.openSak(oppgave);
  }

  render = () => {
    const {
      sakslister,
    } = this.props;
    const {
      reservertAvAnnenSaksbehandler, reservertOppgave, reservertOppgaveStatus,
    } = this.state;
    if (sakslister.length === 0) {
      return null;
    }
    return (
      <>
        <SakslistePanel
          reserverOppgave={this.reserverOppgaveOgApne}
          sakslister={sakslister}
          fetchSakslisteOppgaver={this.fetchSakslisteOppgaver}
          opphevOppgaveReservasjon={this.opphevReservasjon}
          forlengOppgaveReservasjon={this.forlengOppgaveReservasjon}
          flyttReservasjon={this.flyttReservasjon}
        />
        {reservertAvAnnenSaksbehandler && reservertOppgave && reservertOppgaveStatus && (
          <OppgaveErReservertAvAnnenModal
            lukkErReservertModalOgOpneOppgave={this.lukkErReservertModalOgOpneOppgave}
            oppgave={reservertOppgave}
            oppgaveStatus={reservertOppgaveStatus}
          />
        )
        }
      </>
    );
  }
}

const mapStateToProps = state => ({
  k9sakUrl: getK9sakUrl(state),
  k9tilbakeUrl: getK9tilbakeUrl(state),
  sakslister: getSakslisteResult(state),
  goToUrl: url => window.location.assign(url),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators({
    fetchAlleSakslister,
    fetchOppgaverTilBehandling,
    fetchOppgaverTilBehandlingOppgaver,
    fetchReserverteOppgaver,
    reserverOppgave,
    opphevOppgaveReservasjon,
    forlengOppgaveReservasjon,
    flyttReservasjon,
    setValgtSakslisteId,
  }, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(BehandlingskoerIndex);
