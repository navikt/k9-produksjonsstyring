import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import SaksbehandlerNokkeltallPanel from './components/SaksbehandlerNokkeltallPanel';

/**
 * SaksbehandlerNokkeltallIndex
 */
const SaksbehandlerNokkeltallIndex: FunctionComponent = () => (
  <SaksbehandlerNokkeltallPanel nyeOgFerdigstilteOppgaver={nyeOgFerdigstilteOppgaver} />
);

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators({
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SaksbehandlerNokkeltallIndex);
