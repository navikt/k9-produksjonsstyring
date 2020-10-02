import React, { FunctionComponent } from 'react';
import useRestApiRunner from 'api/rest-api-hooks/local-data/useRestApiRunner';
import { K9LosApiKeys } from 'api/k9LosApi';
import NyeOgFerdigstilteOppgaver from 'saksbehandler/saksstotte/nokkeltall/components/nyeOgFerdigstilteOppgaverTsType';
import SaksbehandlerNokkeltallPanel from './components/SaksbehandlerNokkeltallPanel';

/**
 * SaksbehandlerNokkeltallIndex
 */
const SaksbehandlerNokkeltallIndex: FunctionComponent = () => {
  const { startRequest: hentNyeOgFerdigstilte, data: nyeOgFerdigstilteOppgaver = [] } = useRestApiRunner<NyeOgFerdigstilteOppgaver[]>(K9LosApiKeys.HENT_NYE_OG_FERDIGSTILTE_OPPGAVER);
  return (
    <SaksbehandlerNokkeltallPanel nyeOgFerdigstilteOppgaver={nyeOgFerdigstilteOppgaver} />
  );
};

export default SaksbehandlerNokkeltallIndex;
