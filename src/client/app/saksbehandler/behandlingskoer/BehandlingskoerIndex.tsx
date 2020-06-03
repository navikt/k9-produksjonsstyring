import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import k9LosApi from 'api/k9LosApi';
import { getK9sakHref, getK9tilbakeHref } from 'app/paths';
import { Oppgaveko } from 'saksbehandler/behandlingskoer/oppgavekoTsType';
import { getK9sakUrl, getK9tilbakeUrl } from 'app/duck';
import { OppgaveStatus } from 'saksbehandler/oppgaveStatusTsType';
import { Oppgave } from 'saksbehandler/oppgaveTsType';
import OppgaveErReservertAvAnnenModal from 'saksbehandler/components/OppgaveErReservertAvAnnenModal';
import {
  fetchAlleOppgavekoer, getOppgavekoResult, fetchOppgaverTilBehandling, fetchReserverteOppgaver, reserverOppgave, opphevOppgaveReservasjon,
  forlengOppgaveReservasjon, fetchOppgaverTilBehandlingOppgaver, flyttReservasjon, setValgtOppgavekoId, endreOppgaveReservasjon,
} from './duck';
import OppgavekoPanel from './components/OppgavekoPanel';

interface OwnProps {
  k9sakUrl: string;
  k9tilbakeUrl: string;
  oppgavekoer: Oppgaveko[];
  goToUrl: (url: string) => void;
}


interface DispatchProps {
  fetchOppgaverTilBehandling: (id: string) => Promise<{payload: any }>;
  fetchOppgaverTilBehandlingOppgaver: (id: string) => Promise<{payload: any }>;
  fetchAlleOppgavekoer: () => void;
  fetchReserverteOppgaver: (id: string) => Promise<{payload: any }>;
  reserverOppgave: (oppgaveId: string) => Promise<{payload: OppgaveStatus }>;
  opphevOppgaveReservasjon: (oppgaveId: string, begrunnelse: string) => Promise<string>;
  forlengOppgaveReservasjon: (oppgaveId: string) => Promise<string>;
  endreOppgaveReservasjon: (oppgaveId: string, reserverTil: string) => Promise<string>;
  flyttReservasjon: (oppgaveId: string, brukerident: string, begrunnelse: string) => Promise<string>;
  oppgavekoer: Oppgaveko[];
  k9sakUrl: string;
  k9tilbakeUrl: string;
  goToUrl: (url: string) => void;
  setValgtOppgavekoId: (id: string) => void;
}

interface StateProps {
  id?: string;
  reservertAvAnnenSaksbehandler: boolean;
  reservertOppgave?: Oppgave;
  reservertOppgaveStatus?: OppgaveStatus;
}
/**
 * BehandlingskoerIndex
 */
export class BehandlingskoerIndex extends Component<OwnProps & DispatchProps, StateProps> {
  state = {
    id: undefined, reservertAvAnnenSaksbehandler: false, reservertOppgave: undefined, reservertOppgaveStatus: undefined,
  };

  static defaultProps = {
    oppgavekoer: [],
  }

  componentDidMount = () => {
    const { fetchAlleOppgavekoer: getOppgavekoer } = this.props;
    getOppgavekoer();
  }

  componentWillUnmount = () => {
    const { id } = this.state;
    if (id) {
      k9LosApi.OPPGAVER_TIL_BEHANDLING.cancelRestApiRequest();
    }
  }

  fetchOppgavekoOppgaverPolling = () => {
    const { fetchOppgaverTilBehandlingOppgaver: fetchTilBehandling, fetchReserverteOppgaver: fetchReserverte } = this.props;
    const { id } = this.state;
    fetchReserverte(id);
    fetchTilBehandling(id).then(() => {
      setTimeout(() => { this.fetchOppgavekoOppgaverPolling(); }, 5000);
    }).catch(() => undefined);
  }

  fetchOppgavekoOppgaver = (id: string) => {
    this.setState((prevState) => ({ ...prevState, id }));
    const { fetchOppgaverTilBehandling: fetchTilBehandling, fetchReserverteOppgaver: fetchReserverte, setValgtOppgavekoId: setOppgavekoId } = this.props;
    setOppgavekoId(id);
    fetchReserverte(id);
    fetchTilBehandling(id).then((response) =>
    // eslint-disable-next-line react/destructuring-assignment,implicit-arrow-linebreak
      (id === this.state.id ? this.fetchOppgavekoOppgaverPolling(id) : Promise.resolve()));
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
      const { reserverOppgave: reserver, fetchReserverteOppgaver: fetchReserverte } = this.props;
      const { id } = this.state;

      reserver(oppgave.eksternId).then((data: {payload: OppgaveStatus }) => {
        const nyOppgaveStatus = data.payload;
        if (nyOppgaveStatus.erReservert && nyOppgaveStatus.erReservertAvInnloggetBruker) {
          this.openSak(oppgave);
        } else if (nyOppgaveStatus.erReservert && !nyOppgaveStatus.erReservertAvInnloggetBruker) {
          this.setState((prevState) => ({
            ...prevState,
            reservertAvAnnenSaksbehandler: true,
            reservertOppgave: oppgave,
            reservertOppgaveStatus: nyOppgaveStatus,
          }));
        }
      }).then(() => fetchReserverte(id));
    }
  }

  opphevReservasjon = (oppgaveId: string, begrunnelse: string): Promise<any> => {
    const { opphevOppgaveReservasjon: opphevReservasjon, fetchReserverteOppgaver: fetchReserverte } = this.props;
    const { id } = this.state;
    if (!id) {
      return Promise.resolve();
    }
    return opphevReservasjon(oppgaveId, begrunnelse)
      .then(() => fetchReserverte(id));
  }

  forlengOppgaveReservasjon = (oppgaveId: string): Promise<any> => {
    const { forlengOppgaveReservasjon: forlengReservasjon, fetchReserverteOppgaver: fetchReserverte } = this.props;
    const { id } = this.state;
    if (!id) {
      return Promise.resolve();
    }
    return forlengReservasjon(oppgaveId)
      .then(() => fetchReserverte(id));
  }

  endreOppgaveReservasjon = (oppgaveId: string, reserverTil: string): Promise<any> => {
    const { endreOppgaveReservasjon: endreReservasjon, fetchReserverteOppgaver: fetchReserverte } = this.props;
    const { id } = this.state;
    if (!id) {
      return Promise.resolve();
    }
    return endreReservasjon(oppgaveId, reserverTil)
      .then(() => fetchReserverte(id));
  }

  flyttReservasjon = (oppgaveId: string, brukerident: string, begrunnelse: string): Promise<any> => {
    const { flyttReservasjon: flytt, fetchReserverteOppgaver: fetchReserverte } = this.props;
    const { id } = this.state;
    if (!id) {
      return Promise.resolve();
    }
    return flytt(oppgaveId, brukerident, begrunnelse)
      .then(() => fetchReserverte(id));
  }

  lukkErReservertModalOgOpneOppgave = (oppgave: Oppgave) => {
    this.setState((prevState) => ({
      ...prevState, reservertAvAnnenSaksbehandler: false, reservertOppgave: undefined, reservertOppgaveStatus: undefined,
    }));
    this.openSak(oppgave);
  }

  render = () => {
    const {
      oppgavekoer,
    } = this.props;
    const {
      reservertAvAnnenSaksbehandler, reservertOppgave, reservertOppgaveStatus,
    } = this.state;
    if (oppgavekoer.length === 0) {
      return null;
    }
    return (
      <>
        <OppgavekoPanel
          reserverOppgave={this.reserverOppgaveOgApne}
          oppgavekoer={oppgavekoer}
          endreOppgaveReservasjon={this.endreOppgaveReservasjon}
          fetchOppgavekoOppgaver={this.fetchOppgavekoOppgaver}
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
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  k9sakUrl: getK9sakUrl(state),
  k9tilbakeUrl: getK9tilbakeUrl(state),
  oppgavekoer: getOppgavekoResult(state),
  goToUrl: (url) => window.location.assign(url),
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  ...bindActionCreators<DispatchProps, any>({
    fetchAlleOppgavekoer,
    fetchOppgaverTilBehandling,
    fetchOppgaverTilBehandlingOppgaver,
    fetchReserverteOppgaver,
    reserverOppgave,
    opphevOppgaveReservasjon,
    forlengOppgaveReservasjon,
    endreOppgaveReservasjon,
    flyttReservasjon,
    setValgtOppgavekoId,
  }, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(BehandlingskoerIndex);
