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
import Tabs from 'nav-frontend-tabs';
import { getPanelLocationCreator } from 'app/paths';
import Panel from 'nav-frontend-paneler';
import styles from 'avdelingsleder/avdelingslederIndex.less';
import Image from 'sharedComponents/Image';
import { Undertittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import BemanningPanels from 'avdelingsleder/bemanningPanels';
import classNames from 'classnames';

import saksbehandlereGra from '../../../images/saksbehandlereGra.svg';
import saksbehandlereBla from '../../../images/saksbehandlereBla.svg';
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
        <SaksbehandlerePanel
          saksbehandlere={alleSaksbehandlere}
          resetSaksbehandlerSok={reset}
          leggTilSaksbehandler={leggTilSaksbehandler}
          fjernSaksbehandler={fjernSaksbehandler}
        />
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
