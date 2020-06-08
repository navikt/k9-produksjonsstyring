import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import OppgaveErReservertAvAnnenModal from 'saksbehandler/components/OppgaveErReservertAvAnnenModal';
import { Fagsak } from 'saksbehandler/fagsakSearch/fagsakTsType';
import { getK9sakUrl } from 'app/duck';
import { getK9sakHref } from 'app/paths';
import {
  reserverOppgave as reserverOppgaveActionCreator, hentReservasjonsstatus as hentReservasjonActionCreator,
} from 'saksbehandler/behandlingskoer/duck';
import { OppgaveStatus } from 'saksbehandler/oppgaveStatusTsType';
import Oppgave from 'saksbehandler/oppgaveTsType';
import oppgavePropType from 'saksbehandler/oppgavePropType';
import { leggTilBehandletOppgave } from 'saksbehandler/saksstotte/duck';
import fagsakPropType from './fagsakPropType';
import { searchFagsaker, resetFagsakSearch, hentOppgaverForFagsaker as hentOppgaverForFagsakerActionCreator } from './duck';
import {
  getFagsaker,
  getFagsakOppgaver,
  getSearchFagsakerAccessDenied,
} from './fagsakSearchSelectors';
import FagsakSearch from './components/FagsakSearch';

interface SearchResultAccessDenied {
  feilmelding?: string;
}

type Props = Readonly<{
  fagsaker: Fagsak[];
  fagsakOppgaver: Oppgave[];
  searchFagsaker: ({ searchString: string, skalReservere: boolean }) => void;
  searchResultAccessDenied?: SearchResultAccessDenied;
  resetFagsakSearch: () => void;
  goToFagsak: (saknummer: string, behandlingId?: number) => void;
  leggTilBehandletOppgave: (oppgave: Oppgave) => void;
  reserverOppgave: (oppgaveId: string) => Promise<{payload: OppgaveStatus }>;
  hentReservasjonsstatus: (oppgaveId: string) => Promise<{payload: OppgaveStatus }>;
  hentOppgaverForFagsaker: (fagsaker: string[]) => Promise<{payload: Oppgave[] }>;
}>;

interface StateProps {
  skalReservere: boolean;
  reservertAvAnnenSaksbehandler: boolean;
  reservertOppgave?: Oppgave;
  sokStartet: boolean;
  sokFerdig: boolean;
}

/** s
 * FagsakSearchIndex
 *
 * Container komponent. Har ansvar for å vise søkeskjermbildet og å håndtere fagsaksøket
 * mot server og lagringen av resultatet i klientens state.
 */
export class FagsakSearchIndex extends Component<Props, StateProps> {
   state = {
     skalReservere: false,
     reservertAvAnnenSaksbehandler: false,
     reservertOppgave: undefined,
     sokStartet: false,
     sokFerdig: false,
   };

  static propTypes = {
    /**
     * Saksnummer eller fødselsnummer/D-nummer
     */
    fagsaker: PropTypes.arrayOf(fagsakPropType),
    fagsakOppgaver: PropTypes.arrayOf(oppgavePropType),
    searchFagsaker: PropTypes.func.isRequired,
    searchResultAccessDenied: PropTypes.shape({
      feilmelding: PropTypes.string.isRequired,
    }),
    resetFagsakSearch: PropTypes.func.isRequired,
    goToFagsak: PropTypes.func.isRequired,
    reserverOppgave: PropTypes.func.isRequired,
    leggTilBehandletOppgave: PropTypes.func.isRequired,
    hentReservasjonsstatus: PropTypes.func.isRequired,
    hentOppgaverForFagsaker: PropTypes.func.isRequired,
  };

  static defaultProps = {
    fagsaker: [],
    searchResultAccessDenied: undefined,
  };


  componentWillUnmount = () => {
    const { resetFagsakSearch: resetSearch } = this.props;
    resetSearch();
  }

  goToFagsakEllerApneModal = (oppgave: Oppgave) => {
    const { goToFagsak } = this.props;
    if (!oppgave.status.erReservert || (oppgave.status.erReservert && oppgave.status.erReservertAvInnloggetBruker)) {
      this.leggTilBehandletSak(oppgave);
      goToFagsak(oppgave.saksnummer, oppgave.behandlingId);
    } else if (oppgave.status.erReservert && !oppgave.status.erReservertAvInnloggetBruker) {
      this.setState((prevState) => ({ ...prevState, reservertAvAnnenSaksbehandler: true, reservertOppgave: oppgave }));
    }
  }

  leggTilBehandletSak = (oppgave: Oppgave) => {
    const { leggTilBehandletOppgave: leggTilBehandlet } = this.props;
    leggTilBehandlet(oppgave);
  };

  velgFagsakOperasjoner = (oppgave: Oppgave, reserver: boolean) => {
    const { reserverOppgave, goToFagsak } = this.props;
    this.leggTilBehandletSak(oppgave);
    if (oppgave.status.erReservert && !oppgave.status.erReservertAvInnloggetBruker) {
      this.setState((prevState) => ({ ...prevState, reservertAvAnnenSaksbehandler: true, reservertOppgave: oppgave }));
    }
    if (!reserver) {
      this.goToFagsakEllerApneModal(oppgave);
    } else {
      reserverOppgave(oppgave.eksternId).then(() => {
        goToFagsak(oppgave.saksnummer, oppgave.behandlingId);
      });
    }
  };

  reserverOppgaveOgApne = (oppgave: Oppgave, reserver: boolean) => {
    this.velgFagsakOperasjoner(oppgave, reserver);
  }

  sokFagsak = (values: {searchString: string; skalReservere: boolean}) => {
    const {
      searchFagsaker: search, hentOppgaverForFagsaker, hentReservasjonsstatus,
    } = this.props;

    this.setState((prevState) => ({
      ...prevState, skalReservere: values.skalReservere, sokStartet: true, sokFerdig: false,
    }));

    return search(values).then((data: {payload: Fagsak[] }) => {
      const fagsaker = data.payload;
      if (fagsaker.length > 0) {
        hentOppgaverForFagsaker(fagsaker).then(() => {
          this.setState((prevState) => ({ ...prevState, sokStartet: false, sokFerdig: true }));
        });
      } else {
        this.setState((prevState) => ({ ...prevState, sokStartet: false, sokFerdig: true }));
      }
    });
  }

  lukkErReservertModalOgApneOppgave = (oppgave: Oppgave) => {
    const { goToFagsak } = this.props;
    this.setState((prevState) => ({
      ...prevState, reservertAvAnnenSaksbehandler: false, reservertOppgave: undefined,
    }));
    this.leggTilBehandletSak(oppgave);
    goToFagsak(oppgave.saksnummer, oppgave.behandlingId);
  }

  resetSearch = () => {
    const { resetFagsakSearch: resetSearch } = this.props;
    resetSearch();
    this.setState((prevState) => ({ ...prevState, sokStartet: false, sokFerdig: false }));
  }

  render = () => {
    const {
      fagsaker, fagsakOppgaver, searchResultAccessDenied, goToFagsak,
    } = this.props;
    const {
      reservertAvAnnenSaksbehandler, reservertOppgave, sokStartet, sokFerdig,
    } = this.state;
    return (
      <>
        <FagsakSearch
          fagsaker={fagsaker || []}
          fagsakOppgaver={fagsakOppgaver || []}
          searchFagsakCallback={this.sokFagsak}
          searchResultReceived={sokFerdig}
          selectFagsakCallback={goToFagsak}
          selectOppgaveCallback={this.reserverOppgaveOgApne}
          searchStarted={sokStartet}
          searchResultAccessDenied={searchResultAccessDenied}
          resetSearch={this.resetSearch}
        />
        {reservertAvAnnenSaksbehandler && reservertOppgave && (
        <OppgaveErReservertAvAnnenModal
          lukkErReservertModalOgOpneOppgave={this.lukkErReservertModalOgApneOppgave}
          oppgave={reservertOppgave}
          oppgaveStatus={reservertOppgave.status}
        />
        )}
      </>
    );
  }
}

const getGoToFagsakFn = (k9sakUrl) => (saksnummer, behandlingId) => {
  window.location.assign(getK9sakHref(k9sakUrl, saksnummer, behandlingId));
};

const mapStateToProps = (state) => ({
  fagsaker: getFagsaker(state),
  fagsakOppgaver: getFagsakOppgaver(state),
  searchResultAccessDenied: getSearchFagsakerAccessDenied(state),
  goToFagsak: getGoToFagsakFn(getK9sakUrl(state)),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators({
    searchFagsaker,
    resetFagsakSearch,
    reserverOppgave: reserverOppgaveActionCreator,
    leggTilBehandletOppgave,
    hentReservasjonsstatus: hentReservasjonActionCreator,
    hentOppgaverForFagsaker: hentOppgaverForFagsakerActionCreator,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(FagsakSearchIndex);
