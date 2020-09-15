import React, { Component, FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { injectIntl, WrappedComponentProps } from 'react-intl';
import { Driftsmelding } from './driftsmeldingTsType';

import DriftsmeldingePanel from './components/DriftsmeldingerPanel';
import {
  addDriftsmelding, removeDriftsmelding, switchDriftsmelding,
} from './duck';

interface OwnProps {
    addDriftsmelding: (brukerIdent: string) => Promise<string>;
    alleDriftsmeldinger: Driftsmelding[];
    removeDriftsmelding: (brukerIdent: string) => Promise<string>;
    switchDriftsmelding : (id: string, isChecked: boolean) => Promise<string>;
}

/**
 * EndreDriftsmeldingeIndex
 */
const EndreDriftsmeldingerIndex: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  alleDriftsmeldinger, addDriftsmelding: leggTilDriftsmelding,

  removeDriftsmelding: fjernDriftsmelding, switchDriftsmelding: toggleDriftsmelding,
}) => (
  <DriftsmeldingePanel
    driftsmeldinger={alleDriftsmeldinger}
    leggTilDriftsmelding={leggTilDriftsmelding}
    fjernDriftsmelding={fjernDriftsmelding}
    switchDriftsmelding={toggleDriftsmelding}
  />
);

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators({
    addDriftsmelding,
    removeDriftsmelding,
    switchDriftsmelding,
  }, dispatch),
});


export default connect(null, mapDispatchToProps)(injectIntl(EndreDriftsmeldingerIndex));
