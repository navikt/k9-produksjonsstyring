import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { getK9sakUrl } from 'app/duck';
import oppgavePropType from '../oppgavePropType';
import { Oppgave } from '../oppgaveTsType';
import { fetchBehandledeOppgaver, getBehandledeOppgaver } from './duck';
import { getValgtOppgavekoId } from '../behandlingskoer/duck';
import SaksstottePaneler from './components/SaksstottePaneler';


interface TsProps {
  k9sakUrl: string;
  fetchBehandledeOppgaver: () => any;
  sistBehandledeSaker: Oppgave[];
  valgtOppgavekoId?: string;
}

/**
 * SaksstotteIndex
 */
export class SaksstotteIndex extends Component<TsProps> {
  static propTypes = {
    k9sakUrl: PropTypes.string.isRequired,
    sistBehandledeSaker: PropTypes.arrayOf(oppgavePropType),
    fetchBehandledeOppgaver: PropTypes.func.isRequired,
    valgtOppgavekoId: PropTypes.string,
  };

  static defaultProps = {
    sistBehandledeSaker: [],
    valgtOppgavekoId: undefined,
  };

  componentDidMount = () => {
    const { fetchBehandledeOppgaver: fetch } = this.props;
    fetch();
  }

  render = () => {
    const { k9sakUrl, sistBehandledeSaker, valgtOppgavekoId } = this.props;
    return (
      <SaksstottePaneler k9sakUrl={k9sakUrl} sistBehandledeSaker={sistBehandledeSaker} valgtOppgavekoId={valgtOppgavekoId} />
    );
  }
}

const mapStateToProps = state => ({
  k9sakUrl: getK9sakUrl(state),
  sistBehandledeSaker: getBehandledeOppgaver(state),
  valgtOppgavekoId: getValgtOppgavekoId(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators({
    fetchBehandledeOppgaver,
  }, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(SaksstotteIndex);
