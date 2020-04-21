import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { Saksbehandler } from './saksbehandlerTsType';
import saksbehandlerPropType from './saksbehandlerPropType';
import SaksbehandlerePanel from './components/SaksbehandlerePanel';
import {
  fetchAlleSaksbehandlere, getSaksbehandlere, findSaksbehandler, addSaksbehandler, resetSaksbehandlerSok, removeSaksbehandler,
} from './duck';

interface TsProps {
    fetchAlleSaksbehandlere: () => void;
    findSaksbehandler: (brukerIdent: string) => Promise<string>;
    resetSaksbehandlerSok: () => void;
    addSaksbehandler: (brukerIdent: string) => Promise<string>;
    alleSaksbehandlere: Saksbehandler[];
    removeSaksbehandler: (brukerIdent: string) => Promise<string>;
}

/**
 * EndreSaksbehandlereIndex
 */
export class EndreSaksbehandlereIndex extends Component<TsProps> {
    static propTypes = {
      fetchAlleSaksbehandlere: PropTypes.func.isRequired,
      findSaksbehandler: PropTypes.func.isRequired,
      addSaksbehandler: PropTypes.func.isRequired,
      resetSaksbehandlerSok: PropTypes.func.isRequired,
      removeSaksbehandler: PropTypes.func.isRequired,
      alleSaksbehandlere: PropTypes.arrayOf(saksbehandlerPropType),
    };

    static defaultProps = {
      alleSaksbehandlere: [],
    }

    componentDidMount = () => {
      const { fetchAlleSaksbehandlere: fetchSaksbehandlere } = this.props;
      fetchSaksbehandlere();
    }

    render = () => {
      const {
        alleSaksbehandlere, findSaksbehandler: finnSaksbehandler, addSaksbehandler: leggTilSaksbehandler, resetSaksbehandlerSok: reset,
        removeSaksbehandler: fjernSaksbehandler,
      } = this.props;
      return (
        <SaksbehandlerePanel
          saksbehandlere={alleSaksbehandlere}
          finnSaksbehandler={finnSaksbehandler}
          resetSaksbehandlerSok={reset}
          leggTilSaksbehandler={leggTilSaksbehandler}
          fjernSaksbehandler={fjernSaksbehandler}
        />
      );
    }
}

const mapStateToProps = state => ({
  alleSaksbehandlere: getSaksbehandlere(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators({
    fetchAlleSaksbehandlere,
    findSaksbehandler,
    resetSaksbehandlerSok,
    addSaksbehandler,
    removeSaksbehandler,
  }, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(EndreSaksbehandlereIndex);
