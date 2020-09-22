import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import {
  fetchAlleOppgaver as fetchAlleOppgaverActionCreator,
  fetchOppgaverPerDato as fetchOppgaverPerDatoActionCreator,
  fetchFerdigstilteOppgaver as fetchFerdigstilteOppgaverActionCreator,
  fetchFerdigstiltePerDato as fetchFerdigstiltePerDatoActionCreator,
  fetchNyePerDato as fetchNyePerDatoActionCreator,
} from './duck';
import { fetchNyeOgFerdigstilteOppgaverNokkeltall as fetchNyeOgFerdigstilteActionCreator } from '../../saksbehandler/saksstotte/nokkeltall/duck';
import NokkeltallPanel from './components/NokkeltallPanel';

interface TsProps {
  fetchAlleOppgaver: () => void;
  fetchOppgaverPerDato: () => void;
  fetchFerdigstilteOppgaver: () => void;
  fetchFerdigstiltePerDato: () => void;
  fetchNyePerDato: () => void;
  fetchNyeOgFerdigstilte: () => void;
}

/**
 * NokkeltallIndex
 */
export class NokkeltallIndex extends Component<TsProps> {
  componentDidMount = () => {
    const {
      fetchAlleOppgaver, fetchOppgaverPerDato, fetchFerdigstilteOppgaver, fetchFerdigstiltePerDato, fetchNyePerDato, fetchNyeOgFerdigstilte,
    } = this.props;
    fetchAlleOppgaver();
    fetchOppgaverPerDato();
    fetchFerdigstilteOppgaver();
    fetchFerdigstiltePerDato();
    fetchNyePerDato();
    fetchNyeOgFerdigstilte();
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
    fetchFerdigstiltePerDato: fetchFerdigstiltePerDatoActionCreator,
    fetchNyePerDato: fetchNyePerDatoActionCreator,
    fetchNyeOgFerdigstilte: fetchNyeOgFerdigstilteActionCreator,
  }, dispatch),
});

export default connect(null, mapDispatchToProps)(NokkeltallIndex);
