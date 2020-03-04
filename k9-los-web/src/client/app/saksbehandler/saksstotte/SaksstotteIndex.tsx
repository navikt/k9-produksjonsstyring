import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { getK9sakUrl } from 'app/duck';
import oppgavePropType from '../oppgavePropType';
import { Oppgave } from '../oppgaveTsType';
import { fetchBehandledeOppgaver, getBehandledeOppgaver } from './duck';
import { getValgtSakslisteId } from '../behandlingskoer/duck';
import SaksstottePaneler from './components/SaksstottePaneler';


interface TsProps {
  k9sakUrl: string;
  fetchBehandledeOppgaver: () => any;
  sistBehandledeSaker: Oppgave[];
  valgtSakslisteId?: number;
}

/**
 * SaksstotteIndex
 */
export class SaksstotteIndex extends Component<TsProps> {
  static propTypes = {
    k9sakUrl: PropTypes.string.isRequired,
    sistBehandledeSaker: PropTypes.arrayOf(oppgavePropType),
    fetchBehandledeOppgaver: PropTypes.func.isRequired,
    valgtSakslisteId: PropTypes.number,
  };

  static defaultProps = {
    sistBehandledeSaker: [],
    valgtSakslisteId: undefined,
  };

  componentDidMount = () => {
    const { fetchBehandledeOppgaver: fetch } = this.props;
    fetch();
  }

  render = () => {
    const { k9sakUrl, sistBehandledeSaker, valgtSakslisteId } = this.props;
    return (
      <SaksstottePaneler k9sakUrl={k9sakUrl} sistBehandledeSaker={sistBehandledeSaker} valgtSakslisteId={valgtSakslisteId} />
    );
  }
}

const mapStateToProps = state => ({
  k9sakUrl: getK9sakUrl,
  sistBehandledeSaker: getBehandledeOppgaver(state),
  valgtSakslisteId: getValgtSakslisteId,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators({
    fetchBehandledeOppgaver,
  }, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(SaksstotteIndex);
