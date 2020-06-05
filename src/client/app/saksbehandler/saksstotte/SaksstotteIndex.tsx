import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import Oppgave from '../oppgaveTsType';
import { fetchBehandledeOppgaver } from './duck';
import { getValgtOppgavekoId } from '../behandlingskoer/duck';
import SaksstottePaneler from './components/SaksstottePaneler';


interface TsProps {
  fetchBehandledeOppgaver: () => any;
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
    const { fetchBehandledeOppgaver: fetch } = this.props;
    fetch();
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
  }, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(SaksstotteIndex);
