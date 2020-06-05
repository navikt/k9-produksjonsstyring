import React, { Component, ReactNode } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { fetchNyeOgFerdigstilteOppgaverNokkeltall } from './duck';
import SaksbehandlerNokkeltallPanel from './components/SaksbehandlerNokkeltallPanel';

interface OwnProps {
  fetchNyeOgFerdigstilteOppgaverNokkeltall: (oppgavekoId: string) => void;
  valgtOppgavekoId: string;
}

/**
 * SaksbehandlerNokkeltallIndex
 */
export class SaksbehandlerNokkeltallIndex extends Component<OwnProps> {
  componentDidMount = (): void => {
    const {
      fetchNyeOgFerdigstilteOppgaverNokkeltall: fetchNyeOgFerdige, valgtOppgavekoId,
    } = this.props;
    fetchNyeOgFerdige(valgtOppgavekoId);
  }

  componentDidUpdate = (prevProps: OwnProps): void => {
    const {
      fetchNyeOgFerdigstilteOppgaverNokkeltall: fetchNyeOgFerdige, valgtOppgavekoId,
    } = this.props;
    if (prevProps.valgtOppgavekoId !== valgtOppgavekoId) {
      fetchNyeOgFerdige(valgtOppgavekoId);
    }
  }

  render = (): ReactNode => (
    <SaksbehandlerNokkeltallPanel />
  )
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators({
    fetchNyeOgFerdigstilteOppgaverNokkeltall,
  }, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(SaksbehandlerNokkeltallIndex);
