import React, { Component, ReactNode } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { fetchNyeOgFerdigstilteOppgaverNokkeltall } from 'saksbehandler/saksstotte/nokkeltall/duck';
import SaksbehandlerNokkeltallPanel from './components/SaksbehandlerNokkeltallPanel';

interface TsProps {
  fetchNyeOgFerdigstilteOppgaverNokkeltall: (valgtOppgavekoId: string) => void;
  valgtOppgavekoId: string;
}

/**
 * SaksbehandlerNokkeltallIndex
 */
export class SaksbehandlerNokkeltallIndex extends Component<TsProps> {
  componentDidMount = (): void => {
    const {
      fetchNyeOgFerdigstilteOppgaverNokkeltall: fetchNyeOgFerdige, valgtOppgavekoId,
    } = this.props;
    fetchNyeOgFerdige(valgtOppgavekoId);
  }

  componentDidUpdate = (prevProps: TsProps): void => {
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
