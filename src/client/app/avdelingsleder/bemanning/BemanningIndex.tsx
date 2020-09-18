import React, { Component } from 'react';
import {
  addSaksbehandler,
  fetchAlleSaksbehandlere,
  findSaksbehandler,
  getSaksbehandlere, removeSaksbehandler,
  resetSaksbehandlerSok,
} from 'avdelingsleder/bemanning/duck';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import EnkelTeller from 'avdelingsleder/dagensTall/EnkelTeller';
import { Saksbehandler } from './saksbehandlerTsType';
import SaksbehandlerePanel from './components/SaksbehandlerePanel';

interface OwnProps {
    fetchAlleSaksbehandlere: () => void;
    findSaksbehandler: (brukerIdent: string) => Promise<string>;
    resetSaksbehandlerSok: () => void;
    addSaksbehandler: (brukerIdent: string) => Promise<string>;
    alleSaksbehandlere: Saksbehandler[];
    removeSaksbehandler: (brukerIdent: string) => Promise<string>;
}

const smallScreen = window.innerWidth < 1650;

/**
 * BemanningIndex
 */
export class BemanningIndex extends Component<OwnProps> {
    static defaultProps = {
      alleSaksbehandlere: [],
    }

    componentDidMount = () => {
      const { fetchAlleSaksbehandlere: fetchSaksbehandlere } = this.props;
      fetchSaksbehandlere();
    }

    render = () => {
      const {
        alleSaksbehandlere, addSaksbehandler: leggTilSaksbehandler, resetSaksbehandlerSok: reset,
        removeSaksbehandler: fjernSaksbehandler,
      } = this.props;

      return (
        <>
          {!smallScreen && <EnkelTeller antall={alleSaksbehandlere.length} tekst="Saksbehandlere"> </EnkelTeller>}
          <SaksbehandlerePanel
            saksbehandlere={alleSaksbehandlere}
            resetSaksbehandlerSok={reset}
            leggTilSaksbehandler={leggTilSaksbehandler}
            fjernSaksbehandler={fjernSaksbehandler}
          />
        </>
      );
    }
}

const mapStateToProps = (state) => ({
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

export default connect(mapStateToProps, mapDispatchToProps)(BemanningIndex);
