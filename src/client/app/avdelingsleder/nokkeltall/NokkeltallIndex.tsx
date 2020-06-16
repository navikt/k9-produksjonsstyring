import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import {
  fetchAlleOppgaver as fetchAlleOppgaverActionCreator,
  fetchOppgaverPerDato as fetchOppgaverPerDatoActionCreator,
  fetchOppgaverManueltPaVent as fetchOppgaverManueltPaVentActionCreator,
  fetchOppgaverPerForsteStonadsdag as fetchOppgaverPerForsteStonadsdagActionCreator,
} from './duck';
import NokkeltallPanel from './components/NokkeltallPanel';

interface TsProps {
  fetchAlleOppgaver: () => void;
  fetchOppgaverPerDato: () => void;
  fetchOppgaverManueltPaVent: () => void;
  fetchOppgaverPerForsteStonadsdag: () => void;
}

/**
 * NokkeltallIndex
 */
export class NokkeltallIndex extends Component<TsProps> {
  componentDidMount = () => {
    const {
      fetchAlleOppgaver, fetchOppgaverPerDato, fetchOppgaverManueltPaVent, fetchOppgaverPerForsteStonadsdag,
    } = this.props;
    fetchAlleOppgaver();
    fetchOppgaverPerDato();
    fetchOppgaverManueltPaVent();
    fetchOppgaverPerForsteStonadsdag();
  }

  render = () => (
    <NokkeltallPanel />
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators({
    fetchAlleOppgaver: fetchAlleOppgaverActionCreator,
    fetchOppgaverPerDato: fetchOppgaverPerDatoActionCreator,
    fetchOppgaverManueltPaVent: fetchOppgaverManueltPaVentActionCreator,
    fetchOppgaverPerForsteStonadsdag: fetchOppgaverPerForsteStonadsdagActionCreator,
  }, dispatch),
});


export default connect(null, mapDispatchToProps)(NokkeltallIndex);
