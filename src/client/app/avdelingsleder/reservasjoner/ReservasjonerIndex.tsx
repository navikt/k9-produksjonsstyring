import React, { Component } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import {
  fetchAlleReservasjoner as fetchAllereservasjonerActionCreator,
  getAlleReservasjoner, opphevReservasjon, endreOppgaveReservasjon, finnSaksbehandler, resetSaksbehandler, flyttReservasjon,
} from 'avdelingsleder/reservasjoner/duck';
import { connect } from 'react-redux';
import Reservasjon from 'avdelingsleder/reservasjoner/reservasjonTsType';
import k9LosApi from 'api/k9LosApi';
import ReservasjonerTabell from './components/ReservasjonerTabell';

const EMPTY_ARRAY = [];

interface TsProps {
  fetchAlleReservasjoner: () => void;
  reservasjoner: Reservasjon[];
  opphevReservasjon: (oppgaveId: string) => Promise<string>;
  endreOppgaveReservasjon: (oppgaveId: string, reserverTil: string) => Promise<string>;
  finnSaksbehandler: (brukerIdent: string) => Promise<string>;
  resetSaksbehandler: () => Promise<string>;
  flyttReservasjon: (oppgaveId: string, brukerident: string, begrunnelse: string) => Promise<string>;
  requestFinished: boolean;
}

export class ReservasjonerIndex extends Component<TsProps> {
  static defaultProps = {
    reservasjoner: EMPTY_ARRAY,
  }

  componentDidMount = () => {
    const { fetchAlleReservasjoner: fetchReservasjoner } = this.props;
    fetchReservasjoner();
  }

  render = () => {
    const {
      reservasjoner,
      requestFinished,
      opphevReservasjon: opphevOppgaveReservasjon,
      fetchAlleReservasjoner,
      finnSaksbehandler: saksbehandlerSok,
      resetSaksbehandler: nullstillSaksbehandler,
      flyttReservasjon: flyttOppgaveReservasjon,
      endreOppgaveReservasjon: endreReservasjonDato,
    } = this.props;
    return (
      <ReservasjonerTabell
        opphevReservasjon={opphevOppgaveReservasjon}
        reservasjoner={reservasjoner}
        hentAlleReservasjoner={fetchAlleReservasjoner}
        endreOppgaveReservasjon={endreReservasjonDato}
        finnSaksbehandler={saksbehandlerSok}
        resetSaksbehandler={nullstillSaksbehandler}
        flyttReservasjon={flyttOppgaveReservasjon}
        requestFinished={requestFinished}
      />
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators({
    fetchAlleReservasjoner: fetchAllereservasjonerActionCreator,
    opphevReservasjon,
    endreOppgaveReservasjon,
    finnSaksbehandler,
    resetSaksbehandler,
    flyttReservasjon,
  }, dispatch),
});

const mapStateToProps = (state) => ({
  reservasjoner: getAlleReservasjoner(state),
  requestFinished: k9LosApi.HENT_ALLE_RESERVASJONER.getRestApiFinished()(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReservasjonerIndex);
