import React, { useState } from 'react';

import IkkeTilgangTilAvdelingslederPanel from 'avdelingsleder/components/IkkeTilgangTilAvdelingslederPanel';
import useGlobalStateRestApiData from 'api/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import NavAnsatt from 'app/navAnsattTsType';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import SaksbehandlerDashboard from './components/SaksbehandlerDashboard';

/**
 * SaksbehandlerIndex
 */

const SaksbehandlerIndex = () => {
  const { kanSaksbehandle } = useGlobalStateRestApiData<NavAnsatt>(RestApiGlobalStatePathsKeys.NAV_ANSATT);
  const [valgtOppgavekoId, setValgtOppgavekoId] = useState<string>();
  if (!kanSaksbehandle) {
    return <IkkeTilgangTilAvdelingslederPanel />;
  }
  return (
    <SaksbehandlerDashboard
      valgtOppgavekoId={valgtOppgavekoId}
      setValgtOppgaveko={setValgtOppgavekoId}
    />
  );
};

export default SaksbehandlerIndex;
