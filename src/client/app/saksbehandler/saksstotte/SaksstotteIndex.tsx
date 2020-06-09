import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { fetchNyeOgFerdigstilteOppgaverNokkeltall } from 'saksbehandler/saksstotte/nokkeltall/duck';
import { getK9sakUrl } from 'app/duck';
import Oppgave from '../oppgaveTsType';
import { fetchBehandledeOppgaver } from './duck';
import { getValgtOppgavekoId } from '../behandlingskoer/duck';
import SaksstottePaneler from './components/SaksstottePaneler';


interface TsProps {
  fetchBehandledeOppgaver: () => any;
  fetchNyeOgFerdigstilteOppgaverNokkeltall: (oppgavekoId: string) => any;
  sistBehandledeSaker: Oppgave[];
  valgtOppgavekoId?: string;
  k9sakUrl: string;
}

/**
 * SaksstotteIndex
 */
export class SaksstotteIndex extends Component<TsProps> {
  static defaultProps = {
    sistBehandledeSaker: [],
    valgtOppgavekoId: undefined,
  };

  fetchNyeOgFerdigeOppgaver = (oppgavekoId: string) => {
    const { fetchNyeOgFerdigstilteOppgaverNokkeltall: fetchNyeOgFerdigstilte } = this.props;
    fetchNyeOgFerdigstilte(oppgavekoId);
  };

  componentDidMount = () => {
    const { fetchBehandledeOppgaver: fetch } = this.props;
    fetch();
  }

  render = () => {
    const {
      valgtOppgavekoId, k9sakUrl,
    } = this.props;
    return (
      <SaksstottePaneler valgtOppgavekoId={valgtOppgavekoId} k9sakUrl={k9sakUrl} fetchNyeOgFerdigstilte={this.fetchNyeOgFerdigeOppgaver} />
    );
  }
}

const mapStateToProps = (state) => ({
  valgtOppgavekoId: getValgtOppgavekoId(state),
  k9sakUrl: getK9sakUrl(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators({
    fetchBehandledeOppgaver,
    fetchNyeOgFerdigstilteOppgaverNokkeltall,
  }, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(SaksstotteIndex);
