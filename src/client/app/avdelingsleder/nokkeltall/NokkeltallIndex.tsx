import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import {
  fetchAlleOppgaver as fetchAlleOppgaverActionCreator,
  fetchOppgaverPerDato as fetchOppgaverPerDatoActionCreator,
} from './duck';
import NokkeltallPanel from './components/NokkeltallPanel';

interface TsProps {
  fetchAlleOppgaver: () => void;
  fetchOppgaverPerDato: () => void;
}

/**
 * NokkeltallIndex
 */
export class NokkeltallIndex extends Component<TsProps> {
  componentDidMount = () => {
    const {
      fetchAlleOppgaver, fetchOppgaverPerDato,
    } = this.props;
    fetchAlleOppgaver();
    fetchOppgaverPerDato();
  }

  render = () => (
    <NokkeltallPanel />
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators({
    fetchAlleOppgaver: fetchAlleOppgaverActionCreator,
    fetchOppgaverPerDato: fetchOppgaverPerDatoActionCreator,
  }, dispatch),
});


export default connect(null, mapDispatchToProps)(NokkeltallIndex);
