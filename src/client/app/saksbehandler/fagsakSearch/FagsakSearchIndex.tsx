import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import OppgaveErReservertAvAnnenModal from 'saksbehandler/components/OppgaveErReservertAvAnnenModal';
import { Fagsak } from 'saksbehandler/fagsakSearch/fagsakTsType';
import { getK9sakUrl, getNavAnsattKanReservere } from 'app/duck';
import { getK9sakHref } from 'app/paths';
import {
  reserverOppgave as reserverOppgaveActionCreator,
  leggTilBehandletOppgave,
} from 'saksbehandler/behandlingskoer/duck';
import { OppgaveStatus } from 'saksbehandler/oppgaveStatusTsType';
import Oppgave from 'saksbehandler/oppgaveTsType';
import oppgavePropType from 'saksbehandler/oppgavePropType';
import { SokeResultat } from 'saksbehandler/fagsakSearch/sokeResultatTsType';
import sokeResultatPropType from 'saksbehandler/fagsakSearch/sokeResultatPropType';
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
  fagsaker: SokeResultat;
  fagsakOppgaver: Oppgave[];
  searchFagsaker: ({ searchString: string, skalReservere: boolean }) => void;
  searchResultAccessDenied?: SearchResultAccessDenied;
  resetFagsakSearch: () => void;
  goToFagsak: (saknummer: string, behandlingId?: number) => void;
  leggTilBehandletOppgave: (oppgave: Oppgave) => void;
  reserverOppgave: (oppgaveId: string) => Promise<{payload: OppgaveStatus }>;
  hentOppgaverForFagsaker: (fagsaker: string) => Promise<{ payload: Oppgave[] }>;
  kanReservere: boolean;
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
    fagsaker: sokeResultatPropType,
    fagsakOppgaver: PropTypes.arrayOf(oppgavePropType),
    searchFagsaker: PropTypes.func.isRequired,
    searchResultAccessDenied: PropTypes.shape({
      feilmelding: PropTypes.string.isRequired,
    }),
    resetFagsakSearch: PropTypes.func.isRequired,
    goToFagsak: PropTypes.func.isRequired,
    reserverOppgave: PropTypes.func.isRequired,
    leggTilBehandletOppgave: PropTypes.func.isRequired,
    hentOppgaverForFagsaker: PropTypes.func.isRequired,
    kanReservere: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    fagsaker: {
      ikkeTilgang: false,
      fagsaker: [],
    },
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
      this.leggTilBehandletSak(oppgave);
      this.setState((prevState) => ({ ...prevState, reservertAvAnnenSaksbehandler: true, reservertOppgave: oppgave }));
    }
  }

  leggTilBehandletSak = (oppgave: Oppgave) => {
    const { leggTilBehandletOppgave: leggTilBehandlet } = this.props;
    leggTilBehandlet(oppgave);
  };

  velgFagsakOperasjoner = (oppgave: Oppgave, reserver: boolean) => {
    const { reserverOppgave, goToFagsak, kanReservere } = this.props;
    if (oppgave.status.erReservert && !oppgave.status.erReservertAvInnloggetBruker) {
      this.setState((prevState) => ({ ...prevState, reservertAvAnnenSaksbehandler: true, reservertOppgave: oppgave }));
    }

    if (reserver && !kanReservere) {
      this.leggTilBehandletSak(oppgave);
      goToFagsak(oppgave.saksnummer, oppgave.behandlingId);
    }
    if (!reserver) {
      this.goToFagsakEllerApneModal(oppgave);
    } else if (reserver && kanReservere) {
      reserverOppgave(oppgave.eksternId).then(() => {
        this.leggTilBehandletSak(oppgave);
        goToFagsak(oppgave.saksnummer, oppgave.behandlingId);
      });
    } else if (!kanReservere) {
      this.leggTilBehandletSak(oppgave);
      goToFagsak(oppgave.saksnummer, oppgave.behandlingId);
    }
  };

  sokFagsak = (values: {searchString: string; skalReservere: boolean}) => {
    const {
      searchFagsaker: search, hentOppgaverForFagsaker,
    } = this.props;

    this.setState((prevState) => ({
      ...prevState, skalReservere: values.skalReservere, sokStartet: true, sokFerdig: false,
    }));

    return search(values).then((data: {payload: SokeResultat }) => {
      const fagsaker = new Set(data.payload.fagsaker.map((fagsak) => `${fagsak.saksnummer}`));
      if (fagsaker.size > 0) {
        hentOppgaverForFagsaker(Array.from(fagsaker).join(',')).then(() => {
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
          fagsaker={fagsaker}
          fagsakOppgaver={fagsakOppgaver || []}
          searchFagsakCallback={this.sokFagsak}
          searchResultReceived={sokFerdig}
          selectOppgaveCallback={this.velgFagsakOperasjoner}
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
  kanReservere: getNavAnsattKanReservere(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators({
    searchFagsaker,
    resetFagsakSearch,
    reserverOppgave: reserverOppgaveActionCreator,
    leggTilBehandletOppgave,
    hentOppgaverForFagsaker: hentOppgaverForFagsakerActionCreator,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(FagsakSearchIndex);
