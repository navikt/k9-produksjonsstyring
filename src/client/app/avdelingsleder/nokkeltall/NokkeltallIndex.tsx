import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import {
  fetchAlleOppgaver as fetchAlleOppgaverActionCreator,
  fetchOppgaverPerDato as fetchOppgaverPerDatoActionCreator,
  fetchNyeOgFerdigstilteOppgaverMedStonadstype as fetchNyeOgFerdigstilteOppgaverMedStonadstypeActionCreator,
  fetchFerdigstiltePerDato as fetchFerdigstiltePerDatoActionCreator,
  fetchNyePerDato as fetchNyePerDatoActionCreator,
} from './duck';
import { fetchNyeOgFerdigstilteOppgaverNokkeltall as fetchNyeOgFerdigstilteActionCreator } from '../../saksbehandler/saksstotte/nokkeltall/duck';
import NokkeltallPanel from './components/NokkeltallPanel';

interface TsProps {
  fetchAlleOppgaver: () => void;
  fetchOppgaverPerDato: () => void;
  fetchNyeOgFerdigstilteOppgaverMedStonadstype: () => void;
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
      fetchAlleOppgaver, fetchOppgaverPerDato, fetchNyeOgFerdigstilteOppgaverMedStonadstype, fetchFerdigstiltePerDato, fetchNyePerDato, fetchNyeOgFerdigstilte,
    } = this.props;
    fetchAlleOppgaver();
    fetchOppgaverPerDato();
    fetchNyeOgFerdigstilteOppgaverMedStonadstype();
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
    fetchNyeOgFerdigstilteOppgaverMedStonadstype: fetchNyeOgFerdigstilteOppgaverMedStonadstypeActionCreator,
    fetchFerdigstiltePerDato: fetchFerdigstiltePerDatoActionCreator,
    fetchNyePerDato: fetchNyePerDatoActionCreator,
    fetchNyeOgFerdigstilte: fetchNyeOgFerdigstilteActionCreator,
  }, dispatch),
});

export default connect(null, mapDispatchToProps)(NokkeltallIndex);
