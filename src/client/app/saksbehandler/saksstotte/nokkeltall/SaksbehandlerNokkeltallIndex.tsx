import React, { Component, ReactNode } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import SaksbehandlerNokkeltallPanel from './components/SaksbehandlerNokkeltallPanel';

interface OwnProps {
  fetchNyeOgFerdigstilte: () => void;
}

/**
 * SaksbehandlerNokkeltallIndex
 */
export class SaksbehandlerNokkeltallIndex extends Component<OwnProps> {
  componentDidMount = (): void => {
    const { fetchNyeOgFerdigstilte } = this.props;
    fetchNyeOgFerdigstilte();
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
