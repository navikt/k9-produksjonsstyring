import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { fetchNyeOgFerdigstilteOppgaverNokkeltall } from 'saksbehandler/saksstotte/nokkeltall/duck';
import Oppgave from '../oppgaveTsType';
import { fetchBehandledeOppgaver } from './duck';
import { getValgtOppgavekoId } from '../behandlingskoer/duck';
import SaksstottePaneler from './components/SaksstottePaneler';


interface TsProps {
  fetchBehandledeOppgaver: () => any;
  fetchNyeOgFerdigstilteOppgaverNokkeltall: (oppgavekoId: string) => any;
  sistBehandledeSaker: Oppgave[];
  valgtOppgavekoId?: string;
}

/**
 * SaksstotteIndex
 */
export class SaksstotteIndex extends Component<TsProps> {
  static defaultProps = {
    sistBehandledeSaker: [],
    valgtOppgavekoId: undefined,
  };

  componentDidMount = () => {
    const { fetchBehandledeOppgaver: fetch, fetchNyeOgFerdigstilteOppgaverNokkeltall: fetchNye, valgtOppgavekoId } = this.props;
    fetch();
    fetchNye(valgtOppgavekoId);
  }

  render = () => {
    const {
      valgtOppgavekoId,
    } = this.props;
    return (
      <SaksstottePaneler valgtOppgavekoId={valgtOppgavekoId} />
    );
  }
}

const mapStateToProps = (state) => ({
  valgtOppgavekoId: getValgtOppgavekoId(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators({
    fetchBehandledeOppgaver,
    fetchNyeOgFerdigstilteOppgaverNokkeltall,
  }, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(SaksstotteIndex);
