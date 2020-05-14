import React from 'react';

import IkkeTilgangTilAvdelingslederPanel from 'avdelingsleder/components/IkkeTilgangTilAvdelingslederPanel';
import PropTypes from 'prop-types';
import { getNavAnsattKanSaksbehandle } from 'app/duck';
import { connect } from 'react-redux';
import SaksbehandlerDashboard from './components/SaksbehandlerDashboard';


/**
 * SaksbehandlerIndex
 */

interface TsProps {
    kanSaksbehandle: boolean;
}

export const SaksbehandlerIndex = ({
    kanSaksbehandle,
}: TsProps) => {
    if (!kanSaksbehandle) {
        return <IkkeTilgangTilAvdelingslederPanel />;
    }
    return <SaksbehandlerDashboard />;
};

SaksbehandlerIndex.propTypes = {
    kanSaksbehandle: PropTypes.bool,
};

const mapStateToProps = state => ({
    kanSaksbehandle: getNavAnsattKanSaksbehandle(state),
});

SaksbehandlerIndex.defaultProps = {
    kanSaksbehandle: false,
};

export default (connect(mapStateToProps)(SaksbehandlerIndex));
