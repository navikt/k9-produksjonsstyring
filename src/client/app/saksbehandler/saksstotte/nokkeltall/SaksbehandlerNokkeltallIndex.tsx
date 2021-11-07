import React, { FunctionComponent } from 'react';
import { K9LosApiKeys } from 'api/k9LosApi';
import NyeOgFerdigstilteOppgaver from 'saksbehandler/saksstotte/nokkeltall/components/nyeOgFerdigstilteOppgaverTsType';
import { useRestApi } from 'api/rest-api-hooks';
import SaksbehandlerNokkeltallPanel from './components/SaksbehandlerNokkeltallPanel';
import nyeOgFerdigstilteOppgaver from '../../../../mocks/nyeOgFerdigstilteOppgaver';

/**
 * SaksbehandlerNokkeltallIndex
 */
const SaksbehandlerNokkeltallIndex: FunctionComponent = () => (
  <SaksbehandlerNokkeltallPanel nyeOgFerdigstilteOppgaver={nyeOgFerdigstilteOppgaver} />
);

export default SaksbehandlerNokkeltallIndex;
