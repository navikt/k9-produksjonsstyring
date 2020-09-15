import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import k9LosApi from 'api/k9LosApi';
import { getK9sakHref, getK9tilbakeHref } from 'app/paths';
import { Oppgaveko } from 'saksbehandler/behandlingskoer/oppgavekoTsType';
import { getK9sakUrl, getK9tilbakeUrl, getSseUrl } from 'app/duck';
import { OppgaveStatus } from 'saksbehandler/oppgaveStatusTsType';
import Oppgave from 'saksbehandler/oppgaveTsType';
import OppgaveErReservertAvAnnenModal from 'saksbehandler/components/OppgaveErReservertAvAnnenModal';

import {
  fetchAlleOppgavekoer,
  getOppgavekoResult,
  fetchOppgaverTilBehandling,
  fetchReserverteOppgaver,
  reserverOppgave,
  opphevOppgaveReservasjon,
  forlengOppgaveReservasjon,
  fetchOppgaverTilBehandlingOppgaver,
  flyttReservasjon,
  setValgtOppgavekoId,
  endreOppgaveReservasjon,
  leggTilBehandletOppgave,
} from './duck';
import OppgavekoPanel from './components/OppgavekoPanel';

interface OwnProps {
  k9sakUrl: string;
  k9tilbakeUrl: string;
  sseUrl: string;
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
  sseUrl: string;
  k9tilbakeUrl: string;
  goToUrl: (url: string) => void;
  setValgtOppgavekoId: (id: string) => void;
}

interface StateProps {
  id?: string;
  reservertAvAnnenSaksbehandler: boolean;
  reservertOppgave?: Oppgave;
  reservertOppgaveStatus?: OppgaveStatus;
  skjermet: boolean;
}
/**
 * BehandlingskoerIndex
 */
export class BehandlingskoerIndex extends Component<OwnProps & DispatchProps, StateProps> {
  state = {
    id: undefined,
    reservertAvAnnenSaksbehandler: false,
    reservertOppgave: undefined,
    reservertOppgaveStatus: undefined,
    skjermet: undefined,
  };

  static defaultProps = {
    oppgavekoer: [],
  }

  componentDidMount = () => {
    const { sseUrl } = this.props;
    const source = new EventSource(sseUrl, { withCredentials: true });
    source.addEventListener('message', (message) => {
      this.handleEvent(message);
    });

    const { fetchAlleOppgavekoer: getOppgavekoer } = this.props;
    getOppgavekoer();
  }

  componentWillUnmount = () => {
    const { id } = this.state;
    if (id) {
      k9LosApi.OPPGAVER_TIL_BEHANDLING.cancelRestApiRequest();
    }
  }

  handleEvent = (e: MessageEvent) => {
    const data = JSON.parse(e.data);
    const { fetchOppgaverTilBehandlingOppgaver: fetchTilBehandling, fetchReserverteOppgaver: fetchReserverte } = this.props;
    const { id } = this.state;
    const { oppgavekoer } = this.props;
    if (data.melding === 'oppdaterReserverte') {
      fetchReserverte(id);
    } else if (data.melding === 'oppdaterTilBehandling') {
      if (id === data.id) {
        fetchTilBehandling(id);
      }
    }
  }

  fetchOppgavekoOppgaver = (id: string) => {
    this.setState((prevState) => ({ ...prevState, id }));
    this.setState((prevState) => ({ ...prevState, skjermet: this.sjekkOmKoErSkjermet(id) }));
    const { fetchOppgaverTilBehandling: fetchTilBehandling, fetchReserverteOppgaver: fetchReserverte, setValgtOppgavekoId: setOppgavekoId } = this.props;
    setOppgavekoId(id);
    fetchReserverte(id);
    fetchTilBehandling(id);
  }

  openSak = (oppgave: Oppgave) => {
    if (oppgave.system === 'K9SAK') this.openFagsak(oppgave);
    else if (oppgave.system === 'K9TILBAKE') this.openTilbakesak(oppgave);
    else throw new Error('Fagsystemet for oppgaven er ukjent');
  }

  openFagsak = (oppgave: Oppgave) => {
    const { k9sakUrl, goToUrl } = this.props;
    leggTilBehandletOppgave(oppgave);
    goToUrl(getK9sakHref(k9sakUrl, oppgave.saksnummer, oppgave.behandlingId));
  }

  openTilbakesak = (oppgave: Oppgave) => {
    const { k9tilbakeUrl, goToUrl } = this.props;
    goToUrl(getK9tilbakeHref(k9tilbakeUrl, oppgave.saksnummer, oppgave.eksternId));
  }

  reserverOppgaveOgApne = (oppgave: Oppgave) => {
    const { reserverOppgave: reserver, fetchReserverteOppgaver: fetchReserverte } = this.props;
    const { id } = this.state;
    if (oppgave.status.erReservert) {
      this.openSak(oppgave);
    } else {
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
  }

  sjekkOmKoErSkjermet = (id: string) => {
    const { oppgavekoer } = this.props;
    return oppgavekoer.find((ko) => ko.id === id).skjermet;
  }

  render = () => {
    const {
      oppgavekoer,
    } = this.props;
    const {
      reservertAvAnnenSaksbehandler, reservertOppgave, reservertOppgaveStatus, skjermet,
    } = this.state;
    if (oppgavekoer.length === 0) {
      return null;
    }
    return (
      <>
        <OppgavekoPanel
          valgtKoSkjermet={skjermet}
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
  sseUrl: getSseUrl(state),
  oppgavekoer: getOppgavekoResult(state),
  goToUrl: (url) => window.location.assign(url),
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  ...bindActionCreators<DispatchProps, any>({
    fetchAlleOppgavekoer,
    leggTilBehandletOppgave,
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
