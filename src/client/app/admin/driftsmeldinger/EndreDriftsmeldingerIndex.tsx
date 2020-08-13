import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { Driftsmelding } from './driftsmeldingTsType';
import driftsmeldingPropType from './driftsmeldingPropType';
import DriftsmeldingePanel from './components/DriftsmeldingerPanel';
import {
  fetchAlleDriftsmeldinger, getDriftsmeldinger, addDriftsmelding, removeDriftsmelding, switchDriftsmelding,
} from './duck';

interface TsProps {
    fetchAlleDriftsmeldinger: () => void;
    addDriftsmelding: (brukerIdent: string) => Promise<string>;
    alleDriftsmeldinger: Driftsmelding[];
    removeDriftsmelding: (brukerIdent: string) => Promise<string>;
    switchDriftsmelding : (id: string, isChecked: boolean) => Promise<string>;
}

/**
 * EndreDriftsmeldingeIndex
 */
export class EndreDriftsmeldingerIndex extends Component<TsProps> {
    static propTypes = {
      fetchAlleDriftsmeldinger: PropTypes.func.isRequired,
      addDriftsmelding: PropTypes.func.isRequired,
      removeDriftsmelding: PropTypes.func.isRequired,
      switchDriftsmelding: PropTypes.func.isRequired,
      alleDriftsmeldinger: PropTypes.arrayOf(driftsmeldingPropType),
    };

    static defaultProps = {
      alleDriftsmeldinger: [],
    }

    componentDidMount = () => {
      const { fetchAlleDriftsmeldinger: fetchDriftsmeldinge } = this.props;
      fetchDriftsmeldinge();
    }

    render = () => {
      const {
        alleDriftsmeldinger, addDriftsmelding: leggTilDriftsmelding,
        removeDriftsmelding: fjernDriftsmelding, switchDriftsmelding: toggleDriftsmelding,
      } = this.props;
      return (
        <DriftsmeldingePanel
          driftsmeldinger={alleDriftsmeldinger}
          leggTilDriftsmelding={leggTilDriftsmelding}
          fjernDriftsmelding={fjernDriftsmelding}
          switchDriftsmelding={toggleDriftsmelding}
        />
      );
    }
}

const mapStateToProps = (state) => ({
  alleDriftsmeldinger: getDriftsmeldinger(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators({
    fetchAlleDriftsmeldinger,
    addDriftsmelding,
    removeDriftsmelding,
    switchDriftsmelding,
  }, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(EndreDriftsmeldingerIndex);
