import React, { Component } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import {
  fetchAlleReservasjoner as fetchAllereservasjonerActionCreator,
  getAlleReservasjoner, opphevReservasjon,
} from 'avdelingsleder/reservasjoner/duck';
import { connect } from 'react-redux';
import Reservasjon from 'avdelingsleder/reservasjoner/reservasjonTsType';
import ReservasjonerTabell from './components/ReservasjonerTabell';

const EMPTY_ARRAY = [];

interface TsProps {
  fetchAlleReservasjoner: () => void;
  reservasjoner: Reservasjon[];
  opphevReservasjon: (oppgaveId: string) => Promise<string>;
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
      reservasjoner, opphevReservasjon: opphevOppgaveReservasjon, fetchAlleReservasjoner,
    } = this.props;
    return (
      <ReservasjonerTabell
        opphevReservasjon={opphevOppgaveReservasjon}
        reservasjoner={reservasjoner}
        hentAlleReservasjoner={fetchAlleReservasjoner}
      />
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators({
    fetchAlleReservasjoner: fetchAllereservasjonerActionCreator,
    opphevReservasjon,
  }, dispatch),
});

const mapStateToProps = (state) => ({
  reservasjoner: getAlleReservasjoner(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReservasjonerIndex);
