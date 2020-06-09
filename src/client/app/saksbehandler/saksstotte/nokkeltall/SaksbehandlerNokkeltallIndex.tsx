import React, { Component, ReactNode } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import SaksbehandlerNokkeltallPanel from './components/SaksbehandlerNokkeltallPanel';

interface OwnProps {
  fetchNyeOgFerdigstilte: (oppgavekoId: string) => void;
  valgtOppgavekoId: string;
}

/**
 * SaksbehandlerNokkeltallIndex
 */
export class SaksbehandlerNokkeltallIndex extends Component<OwnProps> {
  componentDidMount = (): void => {
    const {
      valgtOppgavekoId, fetchNyeOgFerdigstilte,
    } = this.props;
    fetchNyeOgFerdigstilte(valgtOppgavekoId);
  }

  componentDidUpdate = (prevProps: OwnProps): void => {
    const {
      valgtOppgavekoId, fetchNyeOgFerdigstilte,
    } = this.props;
    if (prevProps.valgtOppgavekoId !== valgtOppgavekoId) {
      fetchNyeOgFerdigstilte(valgtOppgavekoId);
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
  }, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(SaksbehandlerNokkeltallIndex);
