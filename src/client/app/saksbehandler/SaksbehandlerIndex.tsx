import React from 'react';

import IkkeTilgangTilAvdelingslederPanel from 'avdelingsleder/components/IkkeTilgangTilAvdelingslederPanel';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import useGlobalStateRestApiData from 'api/global-data/useGlobalStateRestApiData';
import NavAnsatt from 'app/navAnsattTsType';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import SaksbehandlerDashboard from './components/SaksbehandlerDashboard';

/**
 * SaksbehandlerIndex
 */

const SaksbehandlerIndex = () => {
  const { kanSaksbehandle } = useGlobalStateRestApiData<NavAnsatt>(RestApiGlobalStatePathsKeys.NAV_ANSATT);
  if (!kanSaksbehandle) {
    return <IkkeTilgangTilAvdelingslederPanel />;
  }
  return <SaksbehandlerDashboard />;
};

export default SaksbehandlerIndex;
