import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { Driftsmelding } from './driftsmeldingTsType';
import driftsmeldingPropType from './driftsmeldingPropType';
import DriftsmeldingePanel from './components/DriftsmeldingerPanel';
import {
  fetchAlleDriftsmeldinger, getDriftsmeldinger, findDriftsmelding, addDriftsmelding, resetDriftsmeldingSok, removeDriftsmelding,
} from './duck';

interface TsProps {
    fetchAlleDriftsmeldinger: () => void;
    findDriftsmelding: (brukerIdent: string) => Promise<string>;
    resetDriftsmeldingSok: () => void;
    addDriftsmelding: (brukerIdent: string) => Promise<string>;
    alleDriftsmeldinger: Driftsmelding[];
    removeDriftsmelding: (brukerIdent: string) => Promise<string>;
}

/**
 * EndreDriftsmeldingeIndex
 */
export class EndreDriftsmeldingerIndex extends Component<TsProps> {
    static propTypes = {
      fetchAlleDriftsmeldinger: PropTypes.func.isRequired,
      findDriftsmelding: PropTypes.func.isRequired,
      addDriftsmelding: PropTypes.func.isRequired,
      resetDriftsmeldingSok: PropTypes.func.isRequired,
      removeDriftsmelding: PropTypes.func.isRequired,
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
        alleDriftsmeldinger, findDriftsmelding: finnDriftsmelding, addDriftsmelding: leggTilDriftsmelding, resetDriftsmeldingSok: reset,
        removeDriftsmelding: fjernDriftsmelding,
      } = this.props;
      return (
        <DriftsmeldingePanel
          driftsmeldinger={alleDriftsmeldinger}
          finnDriftsmelding={finnDriftsmelding}
          resetDriftsmeldingSok={reset}
          leggTilDriftsmelding={leggTilDriftsmelding}
          fjernDriftsmelding={fjernDriftsmelding}
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
    findDriftsmelding,
    resetDriftsmeldingSok,
    addDriftsmelding,
    removeDriftsmelding,
  }, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(EndreDriftsmeldingerIndex);
