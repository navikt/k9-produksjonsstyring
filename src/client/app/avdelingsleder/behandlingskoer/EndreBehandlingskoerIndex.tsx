import React, { FunctionComponent, useCallback, useState } from 'react';

import { K9LosApiKeys } from 'api/k9LosApi';

import useRestApiRunner from 'api/rest-api-hooks/local-data/useRestApiRunner';
import { Saksbehandler } from 'avdelingsleder/bemanning/saksbehandlerTsType';
import EndreOppgavekoerPanel from './components/EndreOppgavekoerPanel';

/**
 * EndreBehandlingskoerIndex
 */
const EndreBehandlingskoerIndex: FunctionComponent = () => {
  const [valgtOppgavekoId, setValgtOppgavekoId] = useState<string>();
  const resetValgtOppgavekoId = useCallback(() => setValgtOppgavekoId(undefined), []);

  const { startRequest: hentAlleSaksbehandlere, data: alleSaksbehandlere = [] } = useRestApiRunner<Saksbehandler[]>(K9LosApiKeys.SAKSBEHANDLERE);
  return (
    <EndreOppgavekoerPanel
      setValgtOppgavekoId={setValgtOppgavekoId}
      valgtOppgavekoId={valgtOppgavekoId}
      resetValgtOppgavekoId={resetValgtOppgavekoId}
    />
  );
};

export default EndreBehandlingskoerIndex;
