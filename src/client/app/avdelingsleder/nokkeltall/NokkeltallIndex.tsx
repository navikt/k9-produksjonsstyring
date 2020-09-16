import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import {
  fetchAlleOppgaver as fetchAlleOppgaverActionCreator,
  fetchOppgaverPerDato as fetchOppgaverPerDatoActionCreator,
  fetchFerdigstilteOppgaver as fetchFerdigstilteOppgaverActionCreator,
} from './duck';
import NokkeltallPanel from './components/NokkeltallPanel';

interface TsProps {
  fetchAlleOppgaver: () => void;
  fetchOppgaverPerDato: () => void;
  fetchFerdigstilteOppgaver: () => void;
}

/**
 * NokkeltallIndex
 */
export class NokkeltallIndex extends Component<TsProps> {
  componentDidMount = () => {
    const {
      fetchAlleOppgaver, fetchOppgaverPerDato, fetchFerdigstilteOppgaver,
    } = this.props;
    fetchAlleOppgaver();
    fetchOppgaverPerDato();
    fetchFerdigstilteOppgaver();
  }

  render = () => (
    <NokkeltallPanel />
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators({
    fetchAlleOppgaver: fetchAlleOppgaverActionCreator,
    fetchOppgaverPerDato: fetchOppgaverPerDatoActionCreator,
    fetchFerdigstilteOppgaver: fetchFerdigstilteOppgaverActionCreator,
  }, dispatch),
});

export default connect(null, mapDispatchToProps)(NokkeltallIndex);
