import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import k9LosApi from 'api/k9LosApi';
import { getK9sakHref, getK9tilbakeHref } from 'app/paths';
import oppgavekoPropType from 'saksbehandler/behandlingskoer/oppgavekoPropType';
import { Oppgaveko } from 'saksbehandler/behandlingskoer/oppgavekoTsType';
import { getK9sakUrl, getK9tilbakeUrl } from 'app/duck';
import { OppgaveStatus } from 'saksbehandler/oppgaveStatusTsType';
import { Oppgave } from 'saksbehandler/oppgaveTsType';
import OppgaveErReservertAvAnnenModal from 'saksbehandler/components/OppgaveErReservertAvAnnenModal';
import {
  fetchAlleOppgavekoer, getOppgavekoResult, fetchOppgaverTilBehandling, fetchReserverteOppgaver, reserverOppgave, opphevOppgaveReservasjon,
  forlengOppgaveReservasjon, fetchOppgaverTilBehandlingOppgaver, flyttReservasjon, setValgtOppgavekoId,
} from './duck';
import OppgavekoPanel from './components/OppgavekoPanel';

type TsProps = Readonly<{
  fetchOppgaverTilBehandling: (oppgavekoId: string) => Promise<{payload: any }>;
  fetchOppgaverTilBehandlingOppgaver: (oppgavekoId: string, oppgaveIder?: string) => Promise<{payload: any }>;
  fetchAlleOppgavekoer: () => void;
  fetchReserverteOppgaver: (oppgavekoId: string) => Promise<{payload: any }>;
  reserverOppgave: (oppgaveId: string) => Promise<{payload: OppgaveStatus }>;
  opphevOppgaveReservasjon: (oppgaveId: string, begrunnelse: string) => Promise<string>;
  forlengOppgaveReservasjon: (oppgaveId: string) => Promise<string>;
  flyttReservasjon: (oppgaveId: string, brukerident: string, begrunnelse: string) => Promise<string>;
  oppgavekoer: Oppgaveko[];
  k9sakUrl: string;
  k9tilbakeUrl: string;
  goToUrl: (url: string) => void;
  setValgtOppgavekoId: (oppgavekoId: string) => void;
}>

interface StateProps {
  id?: string;
  reservertAvAnnenSaksbehandler: boolean;
  reservertOppgave?: Oppgave;
  reservertOppgaveStatus?: OppgaveStatus;
}
/**
 * BehandlingskoerIndex
 */
export class BehandlingskoerIndex extends Component<TsProps, StateProps> {
  state = {
    id: undefined, reservertAvAnnenSaksbehandler: false, reservertOppgave: undefined, reservertOppgaveStatus: undefined,
  };

  static propTypes = {
    fetchOppgaverTilBehandling: PropTypes.func.isRequired,
    fetchOppgaverTilBehandlingOppgaver: PropTypes.func.isRequired,
    fetchAlleOppgavekoer: PropTypes.func.isRequired,
    fetchReserverteOppgaver: PropTypes.func.isRequired,
    reserverOppgave: PropTypes.func.isRequired,
    opphevOppgaveReservasjon: PropTypes.func.isRequired,
    forlengOppgaveReservasjon: PropTypes.func.isRequired,
    flyttReservasjon: PropTypes.func.isRequired,
    oppgavekoer: PropTypes.arrayOf(oppgavekoPropType),
    k9sakUrl: PropTypes.string.isRequired,
    k9tilbakeUrl: PropTypes.string.isRequired,
    goToUrl: PropTypes.func.isRequired,
    setValgtOppgavekoId: PropTypes.func.isRequired,
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

  fetchOppgavekoOppgaverPolling = (oppgavekoId: string, oppgaveIder?: string) => {
    const { fetchOppgaverTilBehandlingOppgaver: fetchTilBehandling, fetchReserverteOppgaver: fetchReserverte } = this.props;
    fetchReserverte(oppgavekoId);
    fetchTilBehandling(oppgavekoId, oppgaveIder);
  }

  fetchOppgavekoOppgaver = (oppgavekoId: string) => {
    this.setState(prevState => ({ ...prevState, oppgavekoId }));
    const { fetchOppgaverTilBehandling: fetchTilBehandling, fetchReserverteOppgaver: fetchReserverte, setValgtOppgavekoId: setOppgavekoId } = this.props;
    setOppgavekoId(oppgavekoId);
    fetchReserverte(oppgavekoId);
    fetchTilBehandling(oppgavekoId).then((response) => {
      const { id } = this.state;
      return oppgavekoId === id ? this.fetchOppgavekoOppgaverPolling(oppgavekoId, response.payload.map(o => o.id).join(',')) : Promise.resolve();
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
      const { reserverOppgave: reserver, fetchReserverteOppgaver: fetchReserverte } = this.props;
      const { id } = this.state;

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
    this.setState(prevState => ({
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
        )
        }
      </>
    );
  }
}

const mapStateToProps = state => ({
  k9sakUrl: getK9sakUrl(state),
  k9tilbakeUrl: getK9tilbakeUrl(state),
  oppgavekoer: getOppgavekoResult(state),
  goToUrl: url => window.location.assign(url),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators({
    fetchAlleOppgavekoer,
    fetchOppgaverTilBehandling,
    fetchOppgaverTilBehandlingOppgaver,
    fetchReserverteOppgaver,
    reserverOppgave,
    opphevOppgaveReservasjon,
    forlengOppgaveReservasjon,
    flyttReservasjon,
    setValgtOppgavekoId,
  }, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(BehandlingskoerIndex);
